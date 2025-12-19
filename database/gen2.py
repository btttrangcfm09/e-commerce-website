import psycopg2
from faker import Faker
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

fake = Faker()
load_dotenv()

def generate_mock_orders(num_orders=100):
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    cur = conn.cursor()

    try:
        # Get admin ID for status updates
        cur.execute("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1")
        admin_id = cur.fetchone()[0]
        
        # Set admin context for status history
        cur.execute("SET LOCAL app.current_user_id = %s", (admin_id,))
        
        # Get other required data
        cur.execute("SELECT id FROM users WHERE role = 'CUSTOMER'")
        user_ids = [row[0] for row in cur.fetchall()]
        
        cur.execute("SELECT id, price FROM products")
        products = {row[0]: row[1] for row in cur.fetchall()}
        
        # Disable inventory triggers only
        cur.execute("ALTER TABLE order_items DISABLE TRIGGER check_inventory_trigger")
        cur.execute("ALTER TABLE payments DISABLE TRIGGER after_payment_insert_or_update")
        
        for i in range(num_orders):
            try:
                order_id = fake.uuid4()[:16]
                customer_id = random.choice(user_ids)
                created_at = fake.date_time_between(start_date='-1y', end_date='now')
                
                # Start with PENDING
                cur.execute("""
                    INSERT INTO orders (id, customer_id, total_price, shipping_address, order_status, payment_status, created_at)
                    VALUES (%s, %s, %s, %s, 'PENDING', 'PENDING', %s)
                """, (order_id, customer_id, 0, fake.street_address(), created_at))

                # Add items and calculate total
                total_price = 0
                for product_id in random.sample(list(products.keys()), random.randint(1, 5)):
                    quantity = random.randint(1, 3)
                    price = products[product_id]
                    total_price += price * quantity
                    
                    cur.execute("""
                        INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (fake.uuid4()[:24], order_id, product_id, quantity, price, created_at))

                # Update total price
                cur.execute("""
                    UPDATE orders SET total_price = %s WHERE id = %s
                """, (total_price, order_id))

                # Update to final status (this will trigger status history)
                final_status = random.choices(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'], weights=[15, 25, 50, 10])[0]
                if final_status != 'PENDING':
                    # Simulate status progression
                    if final_status in ['SHIPPED', 'DELIVERED']:
                        cur.execute("UPDATE orders SET order_status = 'SHIPPED' WHERE id = %s", (order_id,))
                    if final_status == 'DELIVERED':
                        cur.execute("UPDATE orders SET order_status = 'DELIVERED' WHERE id = %s", (order_id,))
                    if final_status == 'CANCELED':
                        cur.execute("UPDATE orders SET order_status = 'CANCELED' WHERE id = %s", (order_id,))

                # Set payment status
                payment_status = 'COMPLETED' if final_status in ['SHIPPED', 'DELIVERED'] else random.choice(['PENDING', 'COMPLETED', 'FAILED'])
                
                if final_status != 'CANCELED':
                    cur.execute("""
                        INSERT INTO payments (id, order_id, amount, payment_status, payment_method, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (fake.uuid4()[:28], order_id, total_price, payment_status,
                          random.choice(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL']), created_at))

                if i % 10 == 0:
                    conn.commit()

            except Exception as e:
                print(f"Error processing order {i}: {str(e)}")
                conn.rollback()
                continue

        conn.commit()

    finally:
        cur.execute("ALTER TABLE order_items ENABLE TRIGGER check_inventory_trigger")
        cur.execute("ALTER TABLE payments ENABLE TRIGGER after_payment_insert_or_update")
        conn.commit()
        cur.close()
        conn.close()

if __name__ == "__main__":
    generate_mock_orders()