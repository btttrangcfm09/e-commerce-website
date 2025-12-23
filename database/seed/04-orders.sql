-- ============================================================
-- SEED DATA: ORDERS (GENERATED)
-- ============================================================

-- 1. CLEAN UP OLD DATA (Xóa dữ liệu cũ như yêu cầu)
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.order_status_history CASCADE;
TRUNCATE TABLE public.inventory CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.carts CASCADE;
TRUNCATE TABLE public.cart_items CASCADE;

-- 2. GENERATE RANDOM ORDERS
-- Sử dụng PL/PGSQL để tạo dữ liệu logic (tính tổng tiền, link user/product thực tế)
DO $$
DECLARE
    v_customer_id varchar(255);
    v_order_id char(255);
    v_order_item_id char(255);
    v_payment_id char(255);
    v_product_id int;
    v_product_price decimal(10,2);
    v_quantity int;
    v_total_price decimal(10,2);
    v_status text;
    v_payment_status text;
    v_created_at timestamp;
    v_shipping_addr text := '123 Random St, Random City, Vietnam';
    i int;
    j int;
    v_num_items int;
    v_statuses text[] := ARRAY['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED'];
    v_pay_methods text[] := ARRAY['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'];
BEGIN
    -- Tạo 50 đơn hàng mẫu
    FOR i IN 1..50 LOOP
        
        -- A. Chọn ngẫu nhiên 1 User làm chủ đơn hàng
        SELECT id INTO v_customer_id FROM users ORDER BY random() LIMIT 1;
        
        -- B. Sinh ID ngẫu nhiên (giả lập hex string)
        v_order_id := substring(md5(random()::text) from 1 for 255);
        
        -- C. Random trạng thái & Ngày tạo (trong vòng 30 ngày qua)
        v_status := v_statuses[1 + floor(random() * array_length(v_statuses, 1))::int];
        v_created_at := NOW() - (floor(random() * 30) || ' days')::interval - (floor(random() * 24) || ' hours')::interval;

        -- Logic Payment Status dựa trên Order Status cho hợp lý
        IF v_status = 'DELIVERED' THEN
            v_payment_status := 'COMPLETED';
        ELSIF v_status = 'CANCELED' THEN
            v_payment_status := 'FAILED';
        ELSE
            IF random() > 0.5 THEN v_payment_status := 'COMPLETED'; ELSE v_payment_status := 'PENDING'; END IF;
        END IF;

        -- D. Tạo Items cho đơn hàng (Random 1 đến 5 sản phẩm mỗi đơn)
        v_total_price := 0;
        v_num_items := 1 + floor(random() * 5)::int;

        -- Tạo đơn hàng trước (với giá tạm = 0)
        INSERT INTO public.orders (
            id, customer_id, total_price, shipping_address, order_status, payment_status, created_at
        ) VALUES (
            v_order_id, v_customer_id, 0, v_shipping_addr, v_status::public.order_status, v_payment_status::public.payment_status, v_created_at
        );

        FOR j IN 1..v_num_items LOOP
            -- Lấy ngẫu nhiên sản phẩm
            SELECT id, price INTO v_product_id, v_product_price FROM products ORDER BY random() LIMIT 1;
            v_quantity := 1 + floor(random() * 3)::int; -- Số lượng 1-3
            
            v_order_item_id := substring(md5(random()::text) from 1 for 255);

            -- Insert Order Item
            INSERT INTO public.order_items (id, order_id, product_id, quantity, price, created_at)
            VALUES (v_order_item_id, v_order_id, v_product_id, v_quantity, v_product_price, v_created_at);

            -- Cộng dồn tổng tiền
            v_total_price := v_total_price + (v_product_price * v_quantity);

            -- Trừ kho (Optional - để kho trông thực tế hơn)
            UPDATE products SET stock = GREATEST(0, stock - v_quantity) WHERE id = v_product_id;
        END LOOP;

        -- E. Cập nhật lại tổng tiền chính xác cho Order
        UPDATE public.orders SET total_price = v_total_price WHERE id = v_order_id;

        -- F. Tạo Payment Record (nếu đã thanh toán)55
        IF v_payment_status = 'COMPLETED' THEN
            v_payment_id := substring(md5(random()::text) from 1 for 28);
            INSERT INTO public.payments (
                id, order_id, amount, payment_status, payment_method, created_at
            ) VALUES (
                v_payment_id, v_order_id, v_total_price, 'COMPLETED', 
                v_pay_methods[1 + floor(random() * array_length(v_pay_methods, 1))::int]::public.payment_method, 
                v_created_at + interval '10 minutes'
            );
        END IF;

        -- G. Tạo Order Status History (Lịch sử trạng thái)
        INSERT INTO public.order_status_history (order_id, new_status, changed_by, changed_at)
        VALUES (v_order_id, v_status::public.order_status, 'ADMIN', v_created_at);

    END LOOP;
END $$;