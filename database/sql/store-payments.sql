-- Function to generate unique payment ID
create or replace function generate_payment_id() 
returns char(28) as $$
begin
    return upper(
        substring(md5(random()::text || clock_timestamp()::text) from 1 for 28)
    );
end;
$$ language plpgsql;

-- function to validate payment amount against order total
create or replace function validate_payment_amount(
    p_order_id char(16),
    p_amount decimal(10,2)
) returns boolean as $$
declare
    v_order_total decimal(10,2);
begin
    select total_price into v_order_total
    from orders
    where id = p_order_id;
    
    return p_amount = v_order_total;
end;
$$ language plpgsql;

-- Main function to create new payment
create or replace function create_payment(
    p_order_id char(16),
    p_amount decimal(10,2),
    p_payment_method public.payment_method
) returns char(28) as $$
declare
    v_payment_id char(28);
begin
    -- Validate order exists and is in pending payment status
    if not exists (
        select 1 from orders 
        where id = p_order_id 
        and payment_status = 'PENDING'::public.payment_status
    ) then
        raise exception 'Invalid order or payment already processed';
    end if;

    -- Validate payment amount
    if not validate_payment_amount(p_order_id, p_amount) then
        raise exception 'Payment amount does not match order total';
    end if;

    -- Generate payment id
    v_payment_id := generate_payment_id();

    -- Insert new payment record
    insert into payments (
        id,
        order_id,
        amount,
        payment_status,
        payment_method,
        created_at
    ) values (
        v_payment_id,
        p_order_id,
        p_amount,
        'PENDING'::public.payment_status,
        p_payment_method,
        current_timestamp
    );

    return v_payment_id;
end;
$$ language plpgsql;

-- Read payments
-- Admin + Customer
-- Payments
create or replace function public.get_payment(
    p_payment_id char(28), 
    p_user_id varchar(255)
) 
returns table (
    id char(28),
    order_id char(16),
    amount decimal(10,2),
    payment_status public.payment_status,
    payment_method public.payment_method,
    created_at timestamp,
    order_info json -- Added to include basic order information
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
    
    if v_user_role = 'ADMIN' or exists (
        select 1 
        from public.payments p 
        join public.orders o on p.order_id = o.id 
        where p.id = p_payment_id 
        and o.customer_id = p_user_id
    ) then
        return query 
        select 
            p.*,
            json_build_object(
                'order_status', o.order_status,
                'total_price', o.total_price,
                'customer_id', o.customer_id
            ) as order_info
        from public.payments p
        join public.orders o on p.order_id = o.id
        where p.id = p_payment_id;
    else
        raise exception 'User % does not have permission to view this payment', p_user_id;
    end if;
end; 
$$ language plpgsql;

-- Admin
-- Payments
create or replace function public.get_all_payments(
    p_user_id varchar(255),
    p_limit int default 100,
    p_offset int default 0,
    p_status public.payment_status default null
) 
returns table (
    id char(28),
    order_id char(16),
    amount decimal(10,2),
    payment_status public.payment_status,
    payment_method public.payment_method,
    created_at timestamp,
    order_customer_info json -- Added to include order and customer information
) as $$
declare
    v_user_role public.user_role;
begin
    -- Validate user exists and is admin
    select u.role into v_user_role 
    from public.users u
    where u.id = p_user_id;
    
    if v_user_role is null then
        raise exception 'User % not found', p_user_id;
    end if;
    
    if v_user_role != 'ADMIN' then
        raise exception 'User % does not have permission to view all payments', p_user_id;
    end if;
    
    return query 
    select 
        p.*,
        json_build_object(
            'order_status', o.order_status,
            'customer_id', o.customer_id,
            'customer_email', u.email,
            'customer_name', u.first_name || ' ' || u.last_name
        ) as order_customer_info
    from public.payments p
    join public.orders o on o.id = p.order_id
    join public.users u on u.id = o.customer_id
    where (p_status is null or p.payment_status = p_status)
    order by p.created_at desc
    limit p_limit
    offset p_offset;
end; 
$$ language plpgsql;

-- Customer
-- Payment
create or replace function public.get_customer_payments(
    p_user_id varchar(255),
    p_limit int default 50,
    p_offset int default 0
) 
returns table (
    id char(28),
    order_id char(16),
    amount decimal(10,2),
    payment_status public.payment_status,
    payment_method public.payment_method,
    created_at timestamp,
    order_info json -- Added to include order information
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
        p.*,
        json_build_object(
            'order_status', o.order_status,
            'total_price', o.total_price,
            'items_count', (
                select count(*) 
                from public.order_items oi 
                where oi.order_id = o.id
            )
        ) as order_info
    from public.payments p
    join public.orders o on o.id = p.order_id
    where o.customer_id = p_user_id
    order by p.created_at desc
    limit p_limit
    offset p_offset;
end;
$$ language plpgsql;

-- Trigger to check payment completion
create or replace function public.check_order_payment_completion() 
returns trigger as $$
declare
    v_order_id char(16);
    v_total_amount decimal(10, 2);
    v_order_total decimal(10, 2);
begin
    -- Get order information
    select id, total_price 
    into v_order_id, v_order_total 
    from public.orders 
    where id = NEW.order_id;
    
    -- Calculate total payments for the order
    select coalesce(sum(amount), 0) 
    into v_total_amount 
    from public.payments 
    where order_id = v_order_id 
    and payment_status = 'COMPLETED';
    
    -- Add current payment if it's completed
    if NEW.payment_status = 'COMPLETED' then
        v_total_amount := v_total_amount + NEW.amount;
    end if;
    
    -- Validate payment amount doesn't exceed order total
    if v_total_amount > v_order_total then
        raise exception 'Total payments (%) cannot exceed order total (%)', 
            v_total_amount, v_order_total;
    end if;

    -- Update order payment status if fully paid
    if v_total_amount >= v_order_total then
        update public.orders 
        set payment_status = 'COMPLETED' 
        where id = v_order_id;
    end if;

    return NEW;
end;
$$ language plpgsql;

create trigger after_payment_insert_or_update
after insert or update of payment_status, amount on public.payments
for each row
execute function public.check_order_payment_completion();

-- Update payment
create or replace procedure update_payment_info(
    p_payment_id char(28), 
    p_new_status public.payment_status, 
    p_new_amount decimal(10, 2),
    p_user_id varchar(255)
) as $$
declare
    v_user_role public.user_role;
    v_current_status public.payment_status;
begin
    -- Check user authorization
    select role into v_user_role 
    from public.users 
    where id = p_user_id;
    
    if v_user_role != 'ADMIN' then
        raise exception 'Only administrators can update payment information';
    end if;
    
    -- Get current payment status
    select payment_status into v_current_status 
    from public.payments 
    where id = p_payment_id;
    
    if v_current_status is null then
        raise exception 'Payment % not found', p_payment_id;
    end if;
    
    -- Validate payment amount
    if p_new_amount < 0 then
        raise exception 'Payment amount cannot be negative';
    end if;
    
    -- Validate status transitions
    if v_current_status = 'COMPLETED' and p_new_status != 'FAILED' then
        raise exception 'Cannot modify completed payment unless marking as failed';
    end if;
    
    -- Update payment status and amount
    update public.payments 
    set payment_status = p_new_status,
        amount = p_new_amount 
    where id = p_payment_id;
end;
$$ language plpgsql;