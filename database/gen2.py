import os
import random
from faker import Faker
from dotenv import load_dotenv
import psycopg

fake = Faker()

def load_env():
    here = os.path.dirname(os.path.abspath(__file__))
    load_dotenv(os.path.join(here, ".env"), override=False)

def get_db_config():
    return {
        "dbname": os.getenv("DB_NAME", "ecommerce"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "127.0.0.1"),
        "port": int(os.getenv("DB_PORT", "15432")),
    }

def disable_triggers(conn):
    # chạy trong 1 transaction riêng rồi commit luôn
    with conn.transaction():
        with conn.cursor() as cur:
            cur.execute("ALTER TABLE public.order_items DISABLE TRIGGER check_inventory_trigger")
            cur.execute("ALTER TABLE public.payments DISABLE TRIGGER after_payment_insert_or_update")

def enable_triggers(conn):
    with conn.transaction():
        with conn.cursor() as cur:
            cur.execute("ALTER TABLE public.order_items ENABLE TRIGGER check_inventory_trigger")
            cur.execute("ALTER TABLE public.payments ENABLE TRIGGER after_payment_insert_or_update")

def generate_mock_orders(num_orders=100):
    load_env()
    db_config = get_db_config()

    conn = psycopg.connect(**db_config)

    try:
        # ---- Load required data (commit ngay sau khi load để tránh INTRANS) ----
        with conn.transaction():
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM public.users WHERE role = 'ADMIN' LIMIT 1")
                row = cur.fetchone()
                if not row:
                    raise RuntimeError("No ADMIN user found in public.users")
                admin_id = row[0]

                cur.execute("SELECT id FROM public.users WHERE role = 'CUSTOMER'")
                user_ids = [r[0] for r in cur.fetchall()]
                if not user_ids:
                    raise RuntimeError("No CUSTOMER users found in public.users")

                cur.execute("SELECT id, price FROM public.products")
                products = {r[0]: r[1] for r in cur.fetchall()}
                if not products:
                    raise RuntimeError("No products found in public.products")

        # ---- Disable triggers (transaction riêng) ----
        disable_triggers(conn)

        # ---- Generate orders ----
        for i in range(num_orders):
            try:
                with conn.transaction():
                    with conn.cursor() as cur:
                        # SET LOCAL phải ở trong transaction
                        cur.execute("SET LOCAL app.current_user_id = %s", (admin_id,))

                        order_id = fake.uuid4()  # khuyến nghị dùng full UUID
                        customer_id = random.choice(user_ids)
                        created_at = fake.date_time_between(start_date='-1y', end_date='now')

                        cur.execute("""
                            INSERT INTO public.orders
                              (id, customer_id, total_price, shipping_address, order_status, payment_status, created_at)
                            VALUES
                              (%s, %s, %s, %s, 'PENDING', 'PENDING', %s)
                        """, (order_id, customer_id, 0, fake.street_address(), created_at))

                        total_price = 0.0
                        chosen_products = random.sample(
                            list(products.keys()),
                            random.randint(1, min(5, len(products)))
                        )

                        for product_id in chosen_products:
                            quantity = random.randint(1, 3)
                            price = float(products[product_id])
                            total_price += price * quantity

                            cur.execute("""
                                INSERT INTO public.order_items
                                  (id, order_id, product_id, quantity, price, created_at)
                                VALUES
                                  (%s, %s, %s, %s, %s, %s)
                            """, (fake.uuid4(), order_id, product_id, quantity, price, created_at))

                        cur.execute("""
                            UPDATE public.orders
                            SET total_price = %s
                            WHERE id = %s
                        """, (total_price, order_id))

                        final_status = random.choices(
                            ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'],
                            weights=[15, 25, 50, 10]
                        )[0]

                        if final_status != 'PENDING':
                            if final_status in ['SHIPPED', 'DELIVERED']:
                                cur.execute("UPDATE public.orders SET order_status = 'SHIPPED' WHERE id = %s", (order_id,))
                            if final_status == 'DELIVERED':
                                cur.execute("UPDATE public.orders SET order_status = 'DELIVERED' WHERE id = %s", (order_id,))
                            if final_status == 'CANCELED':
                                cur.execute("UPDATE public.orders SET order_status = 'CANCELED' WHERE id = %s", (order_id,))

                        payment_status = (
                            'COMPLETED' if final_status in ['SHIPPED', 'DELIVERED']
                            else random.choice(['PENDING', 'COMPLETED', 'FAILED'])
                        )

                        if final_status != 'CANCELED':
                            cur.execute("""
                                INSERT INTO public.payments
                                  (id, order_id, amount, payment_status, payment_method, created_at)
                                VALUES
                                  (%s, %s, %s, %s, %s, %s)
                            """, (
                                fake.uuid4(),
                                order_id,
                                total_price,
                                payment_status,
                                random.choice(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL']),
                                created_at
                            ))

                if (i + 1) % 10 == 0:
                    print(f"Inserted {i + 1}/{num_orders} orders")

            except Exception as e:
                # transaction context đã rollback order lỗi
                print(f"[Order {i}] Error: {e}")
                continue

    finally:
        # Dù có lỗi gì cũng cố enable lại triggers
        try:
            # nếu còn transaction dang dở (hiếm), rollback cho sạch
            try:
                conn.rollback()
            except Exception:
                pass
            enable_triggers(conn)
        except Exception as e:
            print(f"WARNING: Failed to re-enable triggers: {e}")

        conn.close()

if __name__ == "__main__":
    generate_mock_orders(100)
