drop table if exists categories cascade;

-- Recreate the table with serial id
create table categories (
    id serial primary key,
    name varchar(255) not null unique,
    parent_category_id integer references categories(id)
);


-- CREATE function
drop function if exists create_category(varchar, integer);
create or replace function create_category(
    p_name varchar,
    p_parent_id integer default null
) returns table (
    success boolean,
    message text,
    category_id integer
) as $$
declare
    v_new_id integer;
begin
    -- Validate name length
    if length(trim(p_name)) < 2 then
        return query select false, 'Category name must be at least 2 characters long', null;
        return;
    end if;

    -- Validate parent exists if provided
    if p_parent_id is not null then
        if not exists (select 1 from categories where id = p_parent_id) then
            return query select false, 'Parent category does not exist', null;
            return;
        end if;
    end if;

    -- Insert new category
    insert into categories (name, parent_category_id)
    values (trim(p_name), p_parent_id)
    returning id into v_new_id;

    return query select true, 'Category created successfully', v_new_id;
end;
$$ language plpgsql;

drop function if exists create_category_slug(varchar);
create or replace function create_category_slug(category_name varchar)
returns varchar as $$
declare
    slug varchar;
begin
    -- Convert to lowercase and replace special characters
    slug := lower(trim(category_name));
    -- Remove accents/diacritics (add more replacements as needed)
    slug := translate(slug, 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
                           'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiioooooooooooooooooouuuuuuuuuuuyyyyyd');
    -- Replace non-alphanumeric chars with hyphen and remove multiple hyphens
    slug := regexp_replace(regexp_replace(slug, '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g');
    -- Remove leading/trailing hyphens
    slug := trim(both '-' from slug);
    return slug;
end;
$$ language plpgsql;


-- READ function
create or replace function get_category(
    p_id integer,
    p_include_tree boolean default false
) returns table (
    id integer,
    name varchar,
    parent_id integer,
    parent_name varchar,
    full_path text
) as $$
begin
    if p_include_tree then
        return query
        select 
            c.id,
            c.name,
            c.parent_category_id,
            p.name as parent_name,
            get_full_category_path(c.id) as full_path
        from categories c
        left join categories p on c.parent_category_id = p.id
        where c.id = p_id;
    else
        return query
        select 
            c.id,
            c.name,
            c.parent_category_id,
            p.name as parent_name,
            null::text as full_path
        from categories c
        left join categories p on c.parent_category_id = p.id
        where c.id = p_id;
    end if;
end;
$$ language plpgsql;

-- Optimized function to get full category path with materialized path pattern
drop function if exists get_full_category_path(integer);
create or replace function get_full_category_path(category_id integer)
returns text as $$
with recursive category_path as (
    select id, name, parent_category_id, create_category_slug(name)::text as path
    from categories
    where id = category_id
    
    union all
    
    select c.id, c.name, c.parent_category_id,
           create_category_slug(c.name) || '/' || cp.path
    from categories c
    inner join category_path cp on c.id = cp.parent_category_id
)
select path
from category_path
where parent_category_id is null
limit 1;
$$ language sql;

-- Optimized function to count subcategories with depth parameter
drop function if exists count_subcategories(integer, integer);
create or replace function count_subcategories(
    parent_category_id integer,
    max_depth integer default null
)
returns table(
    direct_children integer,
    total_descendants integer
) as $$
with recursive category_tree as (
    -- Base case: direct children
    select id, parent_category_id, 1 as depth
    from categories
    where parent_category_id = $1
    
    union all
    
    -- Recursive case: deeper levels
    select c.id, c.parent_category_id, ct.depth + 1
    from categories c
    inner join category_tree ct on c.parent_category_id = ct.id
    where ($2 is null or ct.depth < $2)
)
select 
    (select count(*) from category_tree where depth = 1)::integer as direct_children,
    count(*)::integer as total_descendants
from category_tree;
$$ language sql;

-- UPDATE function
drop function if exists update_category(integer, varchar, integer);
create or replace function update_category(
    p_id integer,
    p_name varchar default null,
    p_parent_id integer default null
) returns table (
    success boolean,
    message text
) as $$
declare
    v_current_parent_id integer;
begin
    -- Check if category exists
    if not exists (select 1 from categories where id = p_id) then
        return query select false, 'Category not found';
        return;
    end if;

    -- Get current parent_id
    select parent_category_id into v_current_parent_id
    from categories where id = p_id;

    -- Validate new parent if provided
    if p_parent_id is not null and p_parent_id != v_current_parent_id then
        -- Prevent self-reference
        if p_parent_id = p_id then
            return query select false, 'Category cannot be its own parent';
            return;
        end if;
        
        -- Check if new parent exists
        if not exists (select 1 from categories where id = p_parent_id) then
            return query select false, 'Parent category does not exist';
            return;
        end if;
    end if;

    -- Update category
    update categories
    set 
        name = coalesce(nullif(trim(p_name), ''), name),
        parent_category_id = coalesce(p_parent_id, parent_category_id)
    where id = p_id;

    return query select true, 'Category updated successfully';
end;
$$ language plpgsql;

-- DELETE function
-- Optimized function to check if category can be safely deleted
drop function if exists can_delete_category(integer);
create or replace function can_delete_category(category_id integer)
returns table(
    can_delete boolean,
    reason text
) as $$
declare
    product_count integer;
    subcategory_count integer;
begin
    -- Check products
    select count(*) into product_count
    from products p
    where p.category_id = $1;
    
    if product_count > 0 then
        return query select false, 
            format('Category has %s associated products', product_count);
        return;
    end if;
    
    -- Check subcategories
    select count(*) into subcategory_count
    from categories
    where parent_category_id = $1;
    
    if subcategory_count > 0 then
        return query select false,
            format('Category has %s subcategories', subcategory_count);
        return;
    end if;
    
    return query select true, 'Category can be safely deleted';
end;
$$ LANGUAGE plpgsql;

drop function if exists delete_category(integer, boolean);
create or replace function delete_category(
    p_id integer,
    p_force boolean default false
) returns table (
    success boolean,
    message text
) as $$
declare
    v_can_delete boolean;
    v_reason text;
begin
    -- Check if category exists
    if not exists (select 1 from categories where id = p_id) then
        return query select false, 'Category not found';
        return;
    end if;

    -- Check if category can be deleted
    select * into v_can_delete, v_reason 
    from can_delete_category(p_id);

    if not v_can_delete and not p_force then
        return query select false, v_reason;
        return;
    end if;

    -- Delete category
    delete from categories where id = p_id;
    
    return query select true, 'Category deleted successfully';
end;
$$ language plpgsql;