CREATE OR REPLACE PROCEDURE public.update_cart_item_quantity(
    p_user_id varchar(255),  -- ID người dùng
    p_product_id INT,        -- ID sản phẩm cần cập nhật
    p_new_quantity INT       -- Số lượng mới cần cập nhật vào giỏ hàng
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_id char(16);           -- Mã giỏ hàng, dùng MD5 16 ký tự
    v_available_stock INT;        -- Số lượng hàng tồn kho
    v_current_quantity INT;
BEGIN
    -- Kiểm tra và lấy cart_id từ user_id
    SELECT id INTO v_cart_id
    FROM public.carts
    WHERE customer_id = p_user_id
    LIMIT 1;

    -- Nếu không có giỏ hàng, tạo mới giỏ hàng cho người dùng
    IF v_cart_id IS NULL THEN
        -- Tạo cart_id bằng MD5, độ dài 16 ký tự
        v_cart_id := substr(md5(random()::text), 1, 16);  -- Tạo cart_id từ MD5
        INSERT INTO public.carts(id, customer_id)
        VALUES (v_cart_id, p_user_id);  -- Thêm giỏ hàng mới với cart_id và p_user_id
    END IF;

    -- Kiểm tra nếu product_id hợp lệ và lấy số lượng tồn kho
    SELECT stock INTO v_available_stock
    FROM public.products
    WHERE id = p_product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product with id % does not exist', p_product_id;
    END IF;

    -- Kiểm tra nếu p_new_quantity hợp lệ (phải là số không âm)
    IF p_new_quantity < 0 THEN
        RAISE EXCEPTION 'Desired quantity must be non-negative';
    END IF;

    -- Kiểm tra nếu số lượng yêu cầu không vượt quá hàng tồn kho
    IF p_new_quantity > v_available_stock THEN
        RAISE EXCEPTION 'Desired quantity (%s) exceeds available stock (%s) for product_id=%', 
                        p_new_quantity, v_available_stock, p_product_id;
    END IF;
    
    -- Kiểm tra số lượng sản phẩm trong giỏ
    SELECT quantity INTO v_current_quantity
    FROM public.cart_items
    WHERE cart_id = v_cart_id AND product_id = p_product_id;

    -- Nếu sản phẩm có trong giỏ hàng, cập nhật số lượng
    IF v_current_quantity IS NOT NULL THEN
        -- Nếu quantity = 0 thì xóa sản phẩm khỏi giỏ
        IF p_new_quantity = 0 THEN
            DELETE FROM public.cart_items
            WHERE cart_id = v_cart_id AND product_id = p_product_id;
        ELSE
            -- Cập nhật số lượng sản phẩm trong giỏ
            UPDATE public.cart_items
            SET quantity = p_new_quantity
            WHERE cart_id = v_cart_id AND product_id = p_product_id;
        END IF;
    ELSE
        -- Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm mới vào giỏ
        IF p_new_quantity > 0 THEN
            INSERT INTO public.cart_items(id, cart_id, product_id, quantity)
            VALUES (substr(md5(random()::text), 1, 24), v_cart_id, p_product_id, p_new_quantity);
        END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to update cart item for cart_id=%, product_id=%: %', 
                        v_cart_id, p_product_id, SQLERRM;
END;
$$;

-- Function to get cart contents with product details
drop function if exists public.get_cart_contents(user_id varchar(255));
create or replace function get_cart_contents(
    user_id varchar(255)
) returns table (
    product_id integer,
    product_name varchar(255),
    quantity integer,
    unit_price decimal(10,2),
    total_price decimal(10,2)
) as $$
declare
    v_cart_id varchar(32);
begin
    -- Get user's cart
    select id into v_cart_id
    from public.carts
    where customer_id = user_id;

    if v_cart_id is null then
        raise exception 'No active cart found for user %', user_id;
    end if;

    return query
    select 
        p.id as product_id,
        p.name as product_name,
        ci.quantity,
        p.price as unit_price,
        (p.price * ci.quantity) as total_price
    from public.cart_items ci
    join public.products p on ci.product_id = p.id
    where ci.cart_id = v_cart_id
    order by p.name;
end;
$$ language plpgsql;

-- Function to get cart total
drop function if exists public.get_cart_total(user_id varchar(255));
create or replace function get_cart_total(
    user_id varchar(255)
) returns decimal(10,2) as $$
declare
    v_cart_id varchar(32);
    v_total decimal(10,2);
begin
    -- Get user's cart
    select id into v_cart_id
    from public.carts
    where customer_id = user_id;

    if v_cart_id is null then
        raise exception 'No active cart found for user %', user_id;
    end if;

    select coalesce(sum(p.price * ci.quantity), 0)
    into v_total
    from public.cart_items ci
    join public.products p on ci.product_id = p.id
    where ci.cart_id = v_cart_id;

    return v_total;
end;
$$ language plpgsql;

-- Function to remove item from cart
drop function if exists public.remove_from_cart(user_id varchar(255), product_id int);
create or replace function remove_from_cart(
    p_user_id varchar(255),
    p_product_id integer
) returns void as $$
declare
    v_cart_id varchar(32);
begin
    -- Get user's cart
    select id into v_cart_id
    from public.carts
    where customer_id = p_user_id;

    if v_cart_id is null then
        raise exception 'No active cart found for user %', p_user_id;
    end if;

    -- Remove item
    delete from public.cart_items ci
    where cart_id = v_cart_id and ci.product_id = p_product_id;

    if not found then
        raise exception 'Product % not found in cart', p_product_id;
    end if;
end;
$$ language plpgsql;

-- Function to clear cart
drop function if exists public.clear_cart(user_id varchar(255));
create or replace function clear_cart(
    user_id varchar(255)
) returns void as $$
declare
    v_cart_id varchar(32);
begin
    -- Get user's cart
    select id into v_cart_id
    from public.carts
    where customer_id = user_id;

    if v_cart_id is null then
        raise exception 'No active cart found for user %', user_id;
    end if;

    -- Remove all items from cart
    delete from public.cart_items
    where cart_id = v_cart_id;
end;
$$ language plpgsql;

-- Function to validate cart before checkout
drop function if exists public.validate_cart(user_id varchar(255));
create or replace function validate_cart(
    user_id varchar(255)
) returns boolean as $$
declare
    v_cart_id varchar(32);
    v_invalid_items record;
begin
    -- Get user's cart
    select id into v_cart_id
    from public.carts
    where customer_id = user_id;

    if v_cart_id is null then
        raise exception 'No active cart found for user %', user_id;
    end if;

    -- Check for items with quantity exceeding stock
    select ci.product_id, ci.quantity, p.stock
    into v_invalid_items
    from public.cart_items ci
    join public.products p on ci.product_id = p.id
    where ci.cart_id = v_cart_id
    and ci.quantity > p.stock
    limit 1;

    if found then
        raise exception 'Product % has insufficient stock (requested: %, available: %)',
            v_invalid_items.product_id, v_invalid_items.quantity, v_invalid_items.stock;
    end if;

    return true;
end;
$$ language plpgsql;
-- Add to cart EXISTED
drop procedure if exists public.add_product_to_cart(p_user_id varchar(255), p_product_id int, p_quantity int);
create or replace procedure public.add_product_to_cart(p_user_id varchar(255), p_product_id int, p_quantity int) as $$
declare 
    v_cart_id char(16);
    v_current_quantity int;
    v_available_stock int;
begin
    if p_quantity <= 0 then
        raise exception 'Quantity must be greater than 0';
    end if;

    -- Check if product exists and get its stock in one query
    select stock into v_available_stock 
    from public.products 
    where id = p_product_id;
    
    if v_available_stock is null then
        raise exception 'Product % does not exist', p_product_id;
    end if;

    -- Check if a cart exists for the user. if not, create one.
    select id into v_cart_id 
    from public.carts 
    where customer_id = p_user_id;
    
    if v_cart_id is null then 
        -- Generate a proper char(16) id using MD5
        v_cart_id := substr(md5(random()::text), 1, 16);
        insert into public.carts(id, customer_id) values (v_cart_id, p_user_id);
    end if;

    -- Get current quantity in cart if exists
    select quantity into v_current_quantity
    from public.cart_items 
    where cart_id = v_cart_id 
    and product_id = p_product_id;

    -- Check stock availability considering both new and existing quantity
    if v_current_quantity is not null and (v_current_quantity + p_quantity) > v_available_stock then
        raise exception 'Not enough stock. Current cart: %, Requested: %, Available: %', 
                      v_current_quantity, p_quantity, v_available_stock;
    elsif v_current_quantity is null and p_quantity > v_available_stock then
        raise exception 'Not enough stock. Requested: %, Available: %', 
                      p_quantity, v_available_stock;
    end if;

    -- Update or insert cart item
    insert into public.cart_items(id, cart_id, product_id, quantity) 
    values (substr(md5(random()::text), 1, 24), v_cart_id, p_product_id, p_quantity)
    on conflict (cart_id, product_id) do update 
    set quantity = cart_items.quantity + EXCLUDED.quantity;
    
end; 
$$ language plpgsql;