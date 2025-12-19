alter table inventory add column updated_at timestamp;

-- Trigger function to CREATE initial inventory entry
drop function if exists create_initial_inventory cascade;
create or replace function create_initial_inventory()
returns trigger as $$
begin
    -- Only create inventory entry if initial stock > 0
    if new.stock > 0 then
        insert into inventory (
            id,
            product_id,
            quantity,
            change_type,
            change_date
        ) values (
            substring(md5(random()::text) from 1 for 8),
            new.id,
            new.stock,
            'RESTOCK',
            current_timestamp
        );
    end if;
    
    return new;
end;
$$ language plpgsql;

-- Create the trigger
drop trigger if exists after_product_create on products;
create or replace trigger after_product_create
    after insert on products
    for each row
    execute function create_initial_inventory();

-- READ inventory with flexible filtering and pagination
drop function if exists get_inventory_entries;
create or replace function get_inventory_entries(
    -- search params
    p_product_id integer default null,
    p_change_type public.inventory_change_type default null,
    p_start_date timestamp default null,
    p_end_date timestamp default null,
    -- pagination params
    p_page integer default 1,
    p_page_size integer default 10,
    -- sorting params
    p_sort_by text default 'change_date',
    p_sort_order text default 'desc'
) returns table (
    inventory_id char(8),
    product_id integer,
    product_name varchar,
    quantity integer,
    change_type public.inventory_change_type,
    change_date timestamp,
    total_count bigint
) as $$
declare
    v_offset integer;
    v_sort_sql text;
begin
    -- Calculate offset
    v_offset := (p_page - 1) * p_page_size;
    
    -- Validate sort parameters
    if p_sort_by not in ('change_date', 'quantity', 'product_id') then
        raise exception 'invalid sort column: %', p_sort_by;
    end if;
    
    if p_sort_order not in ('asc', 'desc') then
        raise exception 'invalid sort order: %', p_sort_order;
    end if;
    
    v_sort_sql := format('i.%I %s', p_sort_by, p_sort_order);

    return query
    with filtered_inventory as (
        select 
            i.id,
            i.product_id,
            p.name as product_name,
            i.quantity,
            i.change_type,
            i.change_date,
            count(*) over() as total_count
        from inventory i
        join products p on i.product_id = p.id
        where (p_product_id is null or i.product_id = p_product_id)
        and (p_change_type is null or i.change_type = p_change_type)
        and (p_start_date is null or i.change_date >= p_start_date)
        and (p_end_date is null or i.change_date <= p_end_date)
    )
    select *
    from filtered_inventory fi
    order by 
        case when v_sort_sql = 'i.change_date asc' then fi.change_date end asc,
        case when v_sort_sql = 'i.change_date desc' then fi.change_date end desc,
        case when v_sort_sql = 'i.quantity asc' then fi.quantity end asc,
        case when v_sort_sql = 'i.quantity desc' then fi.quantity end desc,
        case when v_sort_sql = 'i.product_id asc' then fi.product_id end asc,
        case when v_sort_sql = 'i.product_id desc' then fi.product_id end desc
    limit p_page_size
    offset v_offset;
end;
$$ language plpgsql;

-- UPDATE inventory entry with validation and history tracking
drop function if exists update_inventory_entry;
create or replace function update_inventory_entry(
    p_inventory_id char(8),
    p_quantity integer default null,
    p_change_type public.inventory_change_type default null
) returns table (
    inventory_id char(8),
    product_name varchar,
    old_quantity integer,
    new_quantity integer,
    old_change_type public.inventory_change_type,
    new_change_type public.inventory_change_type
) as $$
declare
    v_old_quantity integer;
    v_old_change_type public.inventory_change_type;
    v_product_id integer;
begin
    -- Get current values
    select quantity, change_type, product_id 
    into v_old_quantity, v_old_change_type, v_product_id
    from inventory 
    where id = p_inventory_id;
    
    if not found then
        raise exception 'Inventory entry not found';
    end if;

    -- Validate new quantity if provided
    if p_quantity is not null and p_quantity <= 0 then
        raise exception 'Quantity must be positive';
    end if;

    -- For sale type, check stock
    if (p_change_type = 'SALE' or (p_change_type is null and v_old_change_type = 'SALE'))
    and exists (
        select 1 from products
        where id = v_product_id 
        and stock < coalesce(p_quantity, v_old_quantity)
    ) then
        raise exception 'Insufficient stock for sale';
    end if;

    return query
    update inventory 
    set quantity = coalesce(p_quantity, quantity),
        change_type = coalesce(p_change_type, change_type),
        updated_at = current_timestamp
    where id = p_inventory_id
    returning 
        inventory.id,
        (select name from products where id = v_product_id),
        v_old_quantity,
        inventory.quantity,
        v_old_change_type,
        inventory.change_type;
end;
$$ language plpgsql;

-- Function to add stock to existing product
drop function if exists add_product_stock;
create or replace function add_product_stock(
    p_product_id integer,
    p_quantity integer
) returns table (
    product_id integer,
    product_name varchar,
    old_stock integer,
    new_stock integer,
    inventory_id char(8)
) as $$
declare
    v_old_stock integer;
    v_inventory_id char(8);
begin
    -- Validate inputs
    if p_quantity <= 0 then
        raise exception 'Quantity must be positive';
    end if;

    -- Get current stock
    select stock into v_old_stock
    from products
    where id = p_product_id and is_active = true;
    
    if not found then
        raise exception 'Invalid or inactive product_id';
    end if;

    -- Generate inventory id
    v_inventory_id := substring(md5(random()::text) from 1 for 8);

    -- Create inventory entry and update product stock
    insert into inventory (
        id,
        product_id,
        quantity,
        change_type,
        change_date
    ) values (
        v_inventory_id,
        p_product_id,
        p_quantity,
        'RESTOCK',
        current_timestamp
    );

    return query
    update products
    set stock = stock + p_quantity
    where id = p_product_id
    returning 
        id,
        name,
        v_old_stock,
        stock,
        v_inventory_id;
end;
$$ language plpgsql;

-- Function to reduce stock (for sales)
drop function if exists reduce_product_stock;
create or replace function reduce_product_stock(
    p_product_id integer,
    p_quantity integer
) returns table (
    product_id integer,
    product_name varchar,
    old_stock integer,
    new_stock integer,
    inventory_id char(8)
) as $$
declare
    v_old_stock integer;
    v_inventory_id char(8);
begin
    -- Validate inputs
    if p_quantity <= 0 then
        raise exception 'Quantity must be positive';
    end if;

    -- Get and check current stock
    select stock into v_old_stock
    from products
    where id = p_product_id and is_active = true;
    
    if not found then
        raise exception 'Invalid or inactive product_id';
    end if;

    if v_old_stock < p_quantity then
        raise exception 'Insufficient stock. Available: %, requested: %', v_old_stock, p_quantity;
    end if;

    -- Generate inventory id
    v_inventory_id := substring(md5(random()::text) from 1 for 8);

    -- Create inventory entry and update product stock
    insert into inventory (
        id,
        product_id,
        quantity,
        change_type,
        change_date
    ) values (
        v_inventory_id,
        p_product_id,
        p_quantity,
        'SALE',
        current_timestamp
    );

    return query
    update products
    set stock = stock - p_quantity
    where id = p_product_id
    returning 
        id,
        name,
        v_old_stock,
        stock,
        v_inventory_id;
end;
$$ language plpgsql;

-- DELETE inventory
drop function if exists delete_inventory_entry;
create or replace function delete_product_inventory()
returns trigger as $$
begin
    -- Delete related inventory entries
    delete from inventory 
    where product_id = old.id;
    
    return old;
end;
$$ language plpgsql;

-- Create the trigger for hard deletes
drop trigger if exists before_product_hard_delete on products;
create trigger before_product_hard_delete
    before delete on products
    for each row
    execute function delete_product_inventory();