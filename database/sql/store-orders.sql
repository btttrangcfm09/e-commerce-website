-- Add to cart
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

-- Trigger to check inventory is available
create or replace function public.check_inventory() 
returns trigger as $$
begin
    -- Check if product exists
    if not exists (select 1 from public.products where id = new.product_id) then
        raise exception 'Product % does not exist', new.product_id;
    end if;

    -- Check if there's enough stock
    if not exists (
        select 1 
        from public.products 
        where id = new.product_id 
        and stock >= new.quantity
        for update
    ) then
        raise exception 'Insufficient stock for product %. Please check availability', new.product_id;
    end if;
    
    return new;
end; 
$$ language plpgsql;

create trigger check_inventory_trigger
before insert on public.order_items
for each row
execute function public.check_inventory();


-- Create order from cart
create or replace function public.create_order_from_cart(p_user_id varchar(255), p_shipping_address text) 
returns char(16) as $$
declare 
    v_cart_item record;
    v_total_price decimal(10,2) := 0.0;
    v_order_id char(16);
    v_cart_id char(16);
begin
    -- Get cart id
    select id into v_cart_id from public.carts where customer_id = p_user_id;
    if v_cart_id is null then
        raise exception 'No cart found for user %', p_user_id;
    end if;

    -- Check if cart has items
    if not exists (select 1 from public.cart_items where cart_id = v_cart_id) then
        raise exception 'Cart is empty';
    end if;

    -- Create new order with proper char(16) id
    v_order_id := substr(md5(random()::text), 1, 16);
    insert into public.orders(id, customer_id, total_price, shipping_address, order_status, payment_status) 
    values (v_order_id, p_user_id, v_total_price, p_shipping_address, 'PENDING', 'PENDING');

    -- Add cart items to order items and calculate total price
    for v_cart_item in select * from public.cart_items where cart_id = v_cart_id loop
        -- Check stock before inserting item into order_items
        if (select stock from public.products where id = v_cart_item.product_id) < v_cart_item.quantity then
            -- Rollback the entire order if any item is out of stock
            raise exception 'Not enough stock for product %', v_cart_item.product_id;
        end if;
        
        insert into public.order_items(id, order_id, product_id, quantity, price) 
        values (
            substr(md5(random()::text), 1, 24),
            v_order_id, 
            v_cart_item.product_id, 
            v_cart_item.quantity, 
            (select price from public.products where id = v_cart_item.product_id)
        );
        
        v_total_price := v_total_price + (select price from public.products where id = v_cart_item.product_id) * v_cart_item.quantity;
        
        -- Decrease inventory for ordered product
        call decrease_inventory(v_cart_item.product_id, v_cart_item.quantity);
    end loop;
    
    -- Update total price in order
    update public.orders set total_price = v_total_price where id = v_order_id;
    
    -- Clear cart items after moving to order
    delete from public.cart_items where cart_id = v_cart_id;
    
    return v_order_id;
end; 
$$ language plpgsql;

create or replace procedure public.decrease_inventory(p_product_id int, p_quantity int) as $$
declare
    v_current_stock int;
begin
    -- Get current stock with lock
    select stock into v_current_stock 
    from public.products 
    where id = p_product_id 
    for update;
    
    if v_current_stock < p_quantity then
        raise exception 'Not enough stock for product %. Available: %, Requested: %', 
            p_product_id, v_current_stock, p_quantity;
    end if;

    -- Decrease inventory for product
    update public.products 
    set stock = stock - p_quantity 
    where id = p_product_id;
    
    -- Log the change in inventory with proper char(8) id
    insert into public.inventory(id, product_id, quantity, change_type) 
    values (substr(md5(random()::text), 1, 8), p_product_id, p_quantity, 'SALE');
end; 
$$ language plpgsql;


-- Trigger function to log any order status changes into the new table
create or replace function public.log_order_status_change() 
returns trigger as $$
declare
    v_changed_by_id varchar(255);
    v_changed_by_role public.user_role;
begin
    -- Get current user context (this would need to be set by your application)
    v_changed_by_id := current_setting('app.current_user_id', true);
    
    if v_changed_by_id is not null then
        select role into v_changed_by_role 
        from public.users 
        where id = v_changed_by_id;
    end if;

    if TG_OP = 'UPDATE' and OLD.order_status is distinct from NEW.order_status then
        insert into public.order_status_history(
            order_id, 
            old_status, 
            new_status, 
            changed_by,
            changed_at
        )
        values (
            OLD.id, 
            OLD.order_status, 
            NEW.order_status, 
            v_changed_by_role,
            current_timestamp
        );
    end if;
    return NEW;
end;
$$ language plpgsql;

create trigger after_order_status_update
after update of order_status on public.orders -- After order status is updated
for each row
execute function public.log_order_status_change();

-- Update order
create or replace procedure update_order_status(
    p_order_id char(16), 
    p_new_status public.order_status, 
    p_user_id varchar(255)
) as $$
declare
    v_user_role public.user_role;
    v_current_status public.order_status;
    v_order_customer_id varchar(255);
begin
    -- Get user role
    select role into v_user_role 
    from public.users 
    where id = p_user_id;
    
    if v_user_role is null then
        raise exception 'User % not found', p_user_id;
    end if;
    
    -- Get current order status and customer id
    select order_status, customer_id 
    into v_current_status, v_order_customer_id 
    from public.orders 
    where id = p_order_id;
    
    if v_current_status is null then
        raise exception 'Order % not found', p_order_id;
    end if;
    
    -- Validate status transitions
    if v_current_status = 'CANCELED' then
        raise exception 'Cannot update canceled order';
    end if;
    
    if v_current_status = 'DELIVERED' and p_new_status != 'CANCELED' then
        raise exception 'Cannot update delivered order';
    end if;
    
    -- Check authorization and allowed status transitions
    if v_user_role = 'ADMIN' then
        -- Admin can make any valid status change
        update public.orders 
        set order_status = p_new_status 
        where id = p_order_id;
    elsif v_user_role = 'CUSTOMER' 
          and v_order_customer_id = p_user_id 
          and p_new_status = 'CANCELED' then
        -- Customer can only cancel their own orders
        update public.orders 
        set order_status = p_new_status 
        where id = p_order_id;
    else
        raise exception 'Unauthorized status change attempt';
    end if;
end; 
$$ language plpgsql;


-- Read order
-- Admin + Customer
-- Order
create or replace function public.get_order(
    p_user_id varchar(255),
    p_order_id char(16)
) 
returns table (
    id char(16),
    customer_id varchar(255),
    total_price decimal(10,2),
    shipping_address text,
    order_status public.order_status,
    payment_status public.payment_status,
    created_at timestamp,
    items json -- Added to include order items
) as $$
declare
    v_user_role public.user_role;
    v_order_customer_id varchar(255);
begin
    -- Validate user exists
    select u.role into v_user_role 
    from public.users u
    where u.id = p_user_id;
    
    if v_user_role is null then
        raise exception 'User not found';
    end if;
    
    -- Get order's customer_id
    select o.customer_id into v_order_customer_id 
    from public.orders o
    where o.id = p_order_id;
    
    if v_order_customer_id is null then
        raise exception 'Order not found';
    end if;
    
    -- Check authorization
    if v_user_role = 'ADMIN' or (v_user_role = 'CUSTOMER' and v_order_customer_id = p_user_id) then
        return query 
        select 
            o.id,
            o.customer_id,
            o.total_price,
            o.shipping_address,
            o.order_status,
            o.payment_status,
            o.created_at,
            (
                select json_agg(json_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'product_name', p.name
                ))
                from public.order_items oi
                join public.products p on p.id = oi.product_id
                where oi.order_id = o.id
            ) as items
        from public.orders o 
        where o.id = p_order_id;
    else
        raise exception 'User does not have permission to view this order';
    end if;
end; 
$$ language plpgsql;

-- Admin
-- Order
create or replace function public.get_all_orders(
    p_user_id varchar(255),
    p_limit int default 100,
    p_offset int default 0,
    p_status public.order_status default null
) 
returns table (
    id char(16),
    customer_id varchar(255),
    total_price decimal(10,2),
    shipping_address text,
    order_status public.order_status,
    payment_status public.payment_status,
    created_at timestamp,
    customer_info json
) as $$
declare
    v_user_role public.user_role;
begin
    select u.role into v_user_role 
    from public.users u
    where u.id = p_user_id;
    
    if v_user_role is null then
        raise exception 'User % not found', p_user_id;
    end if;
    
    if v_user_role != 'ADMIN' then
        raise exception 'User % does not have permission to view all orders', p_user_id;
    end if;
    
    return query 
    select 
        o.*,
        json_build_object(
            'username', u.username,
            'email', u.email,
            'first_name', u.first_name,
            'last_name', u.last_name
        ) as customer_info
        
    from public.orders o
    join public.users u on u.id = o.customer_id
    where (p_status is null or o.order_status = p_status)
    order by o.created_at desc
    limit p_limit
    offset p_offset;
end; 
$$ language plpgsql;

drop function if exists get_dashboard_stats();
create or replace function get_dashboard_stats() 
returns table (
    total_revenue decimal(10,2),
    total_orders bigint,
    active_customers bigint,
    low_stock_products bigint
) as $$
begin
    return query
    select 
        coalesce(sum(total_price), 0) as total_revenue,
        count(*) as total_orders,
        count(distinct customer_id) as active_customers,
        (select count(*) from products where stock < 10) as low_stock_products
    from orders 
    where created_at >= date_trunc('month', current_date);
end;
$$ language plpgsql;

drop function if exists get_sales_overview(int);
create or replace function get_sales_overview(days int)
returns table (
    date date,
    sales decimal(10,2),
    orders bigint
) as $$
begin
    return query
    select 
        date_trunc('day', created_at)::date,
        sum(total_price) as sales,
        count(*) as orders
    from orders
    where created_at >= current_date - make_interval(days := days)
    group by 1
    order by 1;
end;
$$ language plpgsql;

-- Customer
-- Order
create or replace function public.get_customer_orders(
    p_user_id varchar(255),
    p_limit int default 50,
    p_offset int default 0,
    p_status public.order_status default null
) 
returns table (
    id char(16),
    total_price decimal(10,2),
    shipping_address text,
    order_status public.order_status,
    payment_status public.payment_status,
    created_at timestamp,
    items json -- Added to include order items
) as $$
declare
    v_user_role public.user_role;
begin
    -- Validate user exists
    select u.role into v_user_role 
    from public.users u
    where u.id = p_user_id;
    
    if v_user_role is null then
        raise exception 'User % not found', p_user_id;
    end if;
    
    return query 
    select 
        o.id,
        o.total_price,
        o.shipping_address,
        o.order_status,
        o.payment_status,
        o.created_at,
        (
            select json_agg(json_build_object(
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'price', oi.price
            ))
            from public.order_items oi
            join public.products p on p.id = oi.product_id
            where oi.order_id = o.id
        ) as items
    from public.orders o
    where o.customer_id = p_user_id
    and (p_status is null or o.order_status = p_status)
    order by o.created_at desc
    limit p_limit
    offset p_offset;
end; 
$$ language plpgsql;