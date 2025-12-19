-- Add column is_active to products table for soft delete
alter table products 
add column is_active boolean default true;

-- CREATE (Insert) product with proper validation
drop function if exists create_product(varchar, text, decimal, integer, integer, text[]);
create or replace function create_product(
    p_name varchar,
    p_description text,
    p_price decimal(10,2),
    p_stock integer,
    p_category_id integer,
    p_image_urls text[] default null
) returns table (
    id integer,
    name varchar,
    price decimal(10,2)
) as $$
begin
    -- validate inputs
    if p_price < 0 then
        raise exception 'Price cannot be negative';
    end if;
    
    if p_stock < 0 then
        raise exception 'Stock cannot be negative';
    end if;

    if not exists (select 1 from categories c where c.id = p_category_id) then
        raise exception 'Invalid category_id';
    end if;

    return query
    insert into products (name, description, price, stock, category_id, image_urls)
    values (p_name, p_description, p_price, p_stock, p_category_id, p_image_urls)
    returning products.id AS product_id, products.name AS product_name, products.price AS product_price;
end;
$$ language plpgsql;

-- READ product(s) with flexible filtering and sorting
drop function if exists get_products(text, integer, decimal, decimal, boolean, integer, integer, text, text);
create or replace function get_products(
    p_search text default null,
    p_category_id integer default null,
    p_min_price decimal default null,
    p_max_price decimal default null,
    p_include_inactive boolean default false,
    p_page integer default 1,
    p_page_size integer default 10,
    p_sort_by text default 'id',
    p_sort_order text default 'asc'
) returns table (
    product_id integer,
    product_name varchar,
    product_description text,
    product_price decimal(10,2),
    product_stock integer,
    product_image_urls text[],
    category_name varchar,
    category_path text,
    is_active boolean,
    total_count bigint
) as $$
begin
    if p_sort_by not in ('id', 'name', 'price', 'stock') then
        raise exception 'Invalid sort_by parameter';
    end if;
    
    if p_sort_order not in ('asc', 'desc') then
        raise exception 'Invalid sort_order parameter';
    end if;

    return query
    with recursive category_tree as (
        select id
        from categories
        where id = coalesce(p_category_id, id)
        
        union all
        
        select c.id
        from categories c
        inner join category_tree ct on c.parent_category_id = ct.id
    )
    select 
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.stock as product_stock,
        p.image_urls as product_image_urls,
        c.name as category_name,
        get_full_category_path(c.id) as category_path,
        p.is_active,
        count(*) over() as total_count
    from products p
    left join categories c on p.category_id = c.id
    where (p_search is null or (
        p.name ilike '%' || p_search || '%' or 
        p.description ilike '%' || p_search || '%'
    ))
    and (p_category_id is null or p.category_id in (select id from category_tree))
    and (p_min_price is null or p.price >= p_min_price)
    and (p_max_price is null or p.price <= p_max_price)
    and (p_include_inactive = true or p.is_active = true)
    order by 
        case when p_sort_by = 'id' and p_sort_order = 'asc' then p.id end asc,
        case when p_sort_by = 'id' and p_sort_order = 'desc' then p.id end desc,
        case when p_sort_by = 'name' and p_sort_order = 'asc' then p.name end asc,
        case when p_sort_by = 'name' and p_sort_order = 'desc' then p.name end desc,
        case when p_sort_by = 'price' and p_sort_order = 'asc' then p.price end asc,
        case when p_sort_by = 'price' and p_sort_order = 'desc' then p.price end desc,
        case when p_sort_by = 'stock' and p_sort_order = 'asc' then p.stock end asc,
        case when p_sort_by = 'stock' and p_sort_order = 'desc' then p.stock end desc
    limit p_page_size
    offset (p_page - 1) * p_page_size;
end;
$$ language plpgsql;

create or replace function get_product_details(p_product_id integer)
returns table (
    product_id integer,
    product_name varchar,
    product_description text,
    product_price decimal(10,2),
    product_stock integer,
    product_image_urls text[],
    category_id integer,
    category_name varchar,
    is_active boolean
) as $$
begin
    return query
    select 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_urls,
        c.id as category_id,
        c.name as category_name,
        p.is_active
    from products p
    left join categories c on p.category_id = c.id
    where p.id = p_product_id;
end;
$$ language plpgsql;

-- UPDATE product with validation
drop function if exists update_product(integer, varchar, text, decimal, integer, integer, text[]);
create or replace function update_product(
    p_product_id integer,
    p_name varchar default null,
    p_description text default null,
    p_price decimal(10,2) default null,
    p_stock integer default null,
    p_category_id integer default null,
    p_image_urls text[] default null
) returns table (
    product_id integer,
    product_name varchar,
    product_price decimal(10,2)
) as $$
begin
    -- Validate inputs
    if p_price is not null and p_price < 0 then
        raise exception 'Price cannot be negative';
    end if;
    
    if p_stock is not null and p_stock < 0 then
        raise exception 'Stock cannot be negative';
    end if;

    if p_category_id is not null and not exists (select 1 from categories where id = p_category_id) then
        raise exception 'Invalid category_id';
    end if;

    return query
    update products 
    set name = coalesce(p_name, name),
        description = coalesce(p_description, description),
        price = coalesce(p_price, price),
        stock = coalesce(p_stock, stock),
        category_id = coalesce(p_category_id, category_id),
        image_urls = coalesce(p_image_urls, image_urls)
    where id = p_product_id
    returning products.id as product_id, products.name as product_name, products.price as product_price;
end;
$$ language plpgsql;

-- DELETE product with soft delete
drop function if exists delete_product(integer, boolean);
create or replace function delete_product(
    p_product_id integer,
    p_hard_delete boolean default false
) returns table (
    deleted_id integer,
    deleted_name varchar,
    deletion_type text
) as $$
begin
    if p_hard_delete then
        -- Hard delete - only if no orders exist
        if exists (select 1 from order_items where product_id = p_product_id) then
            raise exception 'Cannot hard delete product: exists in orders';
        end if;
        
        -- Remove from cart_items first
        delete from cart_items where product_id = p_product_id;
        
        -- Then delete product
        return query
        delete from products 
        where id = p_product_id
        returning id, name, 'HARD_DELETE'::text;
    else
        -- Soft delete - just mark as inactive
        return query
        update products 
        set is_active = false
        where id = p_product_id
        returning id, name, 'SOFT_DELETE'::text;
    end if;
end;
$$ language plpgsql;

-- Helper function to restore soft-deleted product
drop function if exists restore_product(integer);
create or replace function restore_product(p_product_id integer)
returns table (
    restored_id integer,
    restored_name varchar
) as $$
begin
    return query
    update products 
    set is_active = true
    where id = p_product_id
    returning id, name;
end;
$$ language plpgsql;