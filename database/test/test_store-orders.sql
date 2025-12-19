-- test_store-orders.sql

-- Setup Test Environment
drop schema if exists public cascade;
create schema public;

create type public.user_role as enum('ADMIN', 'CUSTOMER');
create type public.order_status as enum('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELED');
create type public.payment_status as enum('PENDING', 'COMPLETED', 'FAILED');
create type public.payment_method as enum('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL');
create type public.inventory_change_type as enum('RESTOCK', 'SALE');

create table public.users (
    id varchar(255) not null,
    username varchar(255) not null unique,
    password varchar(255) not null,
    email varchar(255) not null unique,
    first_name varchar(255) not null,
    last_name varchar(255) not null,
    role public.user_role not null,
    created_at timestamp not null default now(),
    constraint pk_users primary key (id)
);

create table public.categories (
    id integer not null,
    name varchar(255) not null unique,
    parent_category_id integer,
    constraint pk_categories primary key (id),
    constraint fk_parent_category_id foreign key (parent_category_id) references categories(id)
);

create table public.products (
    id serial not null,
    name varchar(255) not null,
    description text not null,
    price decimal(10, 2) not null,
    stock integer not null default 0,
    image_urls text[],
    category_id int,
    created_at timestamp not null default now(),
    constraint pk_products primary key (id),
    constraint fk_category_id foreign key (category_id) references categories(id),
    check (price >= 0)
);

create table public.orders (
    id char(16) not null,
    customer_id varchar(255) not null,
    total_price decimal(10, 2) not null,
    shipping_address text not null,
    order_status public.order_status not null,
    payment_status public.payment_status not null,
    created_at timestamp not null default now(),
    constraint pk_orders primary key (id),
    constraint fk_customer_id foreign key (customer_id) references users(id),
    check (total_price >= 0)
);

create table public.order_items (
    id char(24) not null,
    order_id char(16) not null unique,
    product_id integer not null,
    quantity integer not null default 1,
    price decimal(10, 2) not null,
    created_at timestamp not null default now(),
    constraint pk_order_items primary key (id, order_id),
    constraint fk_order_id foreign key (order_id) references orders(id),
    constraint fk_product_id foreign key (product_id) references products(id),
    check (quantity >= 0),
    check (price >= 0)
);

create table public.order_status_history (
    id serial primary key,
    order_id char(16) not null,
    old_status public.order_status,
    new_status public.order_status,
    changed_at timestamp default current_timestamp,
    changed_by public.user_role,
    constraint fk_order_id foreign key (order_id) references public.orders(id)
);

create table public.carts (
    id char(16) not null,
    customer_id varchar(255) not null,
    created_at timestamp not null default now(),
    constraint pk_carts primary key (id),
    constraint fk_customer_id foreign key (customer_id) references users(id)
);

create table public.cart_items (
    id char(24) not null,
    cart_id char(16) not null,
    product_id integer not null,
    quantity integer not null default 1,
    created_at timestamp not null default now(),
    constraint fk_cart_id foreign key (cart_id) references carts(id),
    constraint fk_product_id foreign key (product_id) references products(id),
    check (quantity > 0)
);

create table public.inventory (
    id char(8) not null,
    product_id integer not null,
    quantity integer not null,
    change_type public.inventory_change_type not null,
    change_date timestamp not null default now(),
    constraint pk_inventory primary key (id),
    constraint fk_product_id foreign key (product_id) references products(id),
    check (quantity >= 0)
);

create table public.payments (
    id char(28) not null,
    order_id char(16) not null,
    amount decimal(10, 2) not null,
    payment_status public.payment_status not null,
    payment_method public.payment_method not null,
    created_at timestamp not null default now(),
    constraint pk_payments primary key (id),
    constraint fk_order_id foreign key (order_id) references orders(id),
    check (amount >= 0)
);

-- Insert sample data
insert into public.users (id, username, password, email, first_name, last_name, role) values
('0003fbe74ca743ed82b1fdb8265a96cd', 'customer1', 'password', 'customer1@example.com', 'John', 'Doe', 'CUSTOMER'),
('user2', 'admin1', 'password', 'admin1@example.com', 'Admin', 'User', 'ADMIN');

insert into public.categories (id, name) values
(1, 'Electronics'),
(2, 'Books');

insert into public.products (id, name, description, price, stock, category_id) values
(1, 'Laptop', 'A high-end laptop', 1000.00, 10, 1),
(2, 'Book', 'A popular book', 20.00, 50, 2);

-- Test add_product_to_cart
do $$ 
begin
    -- Test adding a product to a cart
    call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 1, 2);
    assert exists (select 1 from public.cart_items where cart_id = (select id from public.carts where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') and product_id = 1 and quantity = 2), 'Test failed: add_product_to_cart';

    -- Test adding a product with invalid quantity (0)
    begin
        call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 1, 0);
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: add_product_to_cart with invalid quantity';
    end;

    -- Test adding a product with invalid quantity (-1)
    begin
        call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 1, -1);
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: add_product_to_cart with invalid quantity';
    end;

    -- Test adding a product that does not exist
    begin
        call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 999, 1);
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: add_product_to_cart with non-existent product';
    end;

    -- Test adding a product with insufficient stock
    begin
        call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 1, 100);
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: add_product_to_cart with insufficient stock';
    end;

    -- Test updating quantity of an existing product in the cart
    call public.add_product_to_cart('0003fbe74ca743ed82b1fdb8265a96cd', 1, 3);
    assert exists (select 1 from public.cart_items where cart_id = (select id from public.carts where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') and product_id = 1 and quantity = 5), 'Test failed: add_product_to_cart updating quantity';
end $$;

-- Test create_order_from_cart
do $$ 
begin
    -- Test creating an order from a cart
    perform public.create_order_from_cart('0003fbe74ca743ed82b1fdb8265a96cd', '123 Main St');
    assert exists (select 1 from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd' and shipping_address = '123 Main St'), 'Test failed: create_order_from_cart';

    -- Test creating an order from an empty cart
    begin
        perform public.create_order_from_cart('0003fbe74ca743ed82b1fdb8265a96cd', '123 Main St');
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: create_order_from_cart with empty cart';
    end;
end $$;

-- Test decrease_inventory
do $$ 
begin
    -- Test decreasing inventory for a product
    call public.decrease_inventory(1, 2);
    assert (select stock from public.products where id = 1) = 8, 'Test failed: decrease_inventory';

    -- Test decreasing inventory with insufficient stock
    begin
        call public.decrease_inventory(1, 100);
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: decrease_inventory with insufficient stock';
    end;
end $$;

-- Test log_order_status_change
do $$ 
begin
    -- Test logging order status changes
    update public.orders set order_status = 'SHIPPED' where id = (select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd');
    assert exists (select 1 from public.order_status_history where order_id = (select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') and new_status = 'SHIPPED'), 'Test failed: log_order_status_change';
end $$;

-- Test update_order_status
do $$ 
begin
    -- Test updating order status by admin
    call public.update_order_status('24dce6bd89508111', 'DELIVERED', '183f2d5ac6f545c58da941a6dd3592ef');
    assert (select order_status from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') = 'DELIVERED', 'Test failed: update_order_status by admin';

    -- Test updating order status by customer
    begin
        call public.update_order_status('24dce6bd89508111', 'CANCELED', '0003fbe74ca743ed82b1fdb8265a96cd');
        exception when others then
            assert sqlstate = 'P0001', 'Test failed: update_order_status by customer';
    end;
end $$;

-- Test create_payment
do $$ 
begin
    -- Test creating a new payment
    perform public.create_payment((select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd'), 1000.00, 'CREDIT_CARD');
    assert exists (select 1 from public.payments where order_id = (select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') and amount = 1000.00), 'Test failed: create_payment';
end $$;

-- -- Test check_order_payment_completion
-- do $$ 
-- begin
--     -- Test payment completion check
--     insert into public.payments (id, order_id, amount, payment_status, payment_method) values ('payment1', (select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd'), 1000.00, 'COMPLETED', 'CREDIT_CARD');
--     assert (select payment_status from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd') = 'COMPLETED', 'Test failed: check_order_payment_completion';
-- end $$;

-- Test update_payment_info
do $$
declare
    payment_id char(28);
begin
    select id into payment_id from public.payments where order_id = (select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd' and payment_status = 'COMPLETED');
    if payment_id is not null then
        -- Test updating payment information by admin
        call public.update_payment_info(payment_id, 'FAILED', 1000.00, '183f2d5ac6f545c58da941a6dd3592ef');
        assert (select payment_status from public.payments where id = payment_id) = 'FAILED', 'Test failed: update_payment_info by admin';
    else
        raise exception 'No completed payment found for the given order';
    end if;
end $$;

-- Test get_order
do $$ 
begin
    -- Test retrieving order details
    perform public.get_order((select id from public.orders where customer_id = '0003fbe74ca743ed82b1fdb8265a96cd'), '0003fbe74ca743ed82b1fdb8265a96cd');
    assert found, 'Test failed: get_order';
end $$;

-- Test get_payment
do $$ 
begin
    -- Test retrieving payment details
    perform public.get_payment('1B3E9E24FD560F1CCE3BC9BF3EB1', '0003fbe74ca743ed82b1fdb8265a96cd');
    assert found, 'Test failed: get_payment';
end $$;

-- Test get_all_orders
do $$ 
begin
    -- Test retrieving all orders by admin
    perform public.get_all_orders('183f2d5ac6f545c58da941a6dd3592ef');
    assert found, 'Test failed: get_all_orders';
end $$;

-- Test get_all_payments
do $$ 
begin
    -- Test retrieving all payments by admin
    perform public.get_all_payments('183f2d5ac6f545c58da941a6dd3592ef');
    assert found, 'Test failed: get_all_payments';
end $$;

-- Test get_customer_orders
do $$ 
begin
    -- Test retrieving customer orders
    perform public.get_customer_orders('0003fbe74ca743ed82b1fdb8265a96cd');
    assert found, 'Test failed: get_customer_orders';
end $$;

-- Test get_customer_payments
do $$ 
begin
    -- Test retrieving customer payments
    perform public.get_customer_payments('0003fbe74ca743ed82b1fdb8265a96cd');
    assert found, 'Test failed: get_customer_payments';
end $$;
