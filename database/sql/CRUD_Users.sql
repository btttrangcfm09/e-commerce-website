-- Cài extension tạo id đúng định dạng
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tạo thêm enum public.account_type
CREATE TYPE public.account_type AS ENUM ('LOCAL', 'GOOGLE', 'GITHUB');

-- Thêm vài cột vào bảng USERS
ALTER TABLE public.users
    ADD COLUMN is_active BOOLEAN DEFAULT FALSE,
    -- ADD COLUMN account_type public.account_type DEFAULT 'LOCAL',
    -- ADD COLUMN code_id VARCHAR(255),
    -- ADD COLUMN code_expired DATE,
    ADD COLUMN phone VARCHAR(20),
    ADD COLUMN address VARCHAR(255),
    ADD COLUMN image VARCHAR(255);

-- Thêm ràng buộc cho cột phone và email
ALTER TABLE public.users
    ADD CONSTRAINT phone_format CHECK (phone ~ '^0[0-9]{9}$'),
    ADD CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Đặt các hàng đã có thành TRUE
-- UPDATE public.users
-- SET is_active = TRUE;

-- Hàm đăng nhập
-- Hàm đăng nhập sử dụng bcrypt
CREATE OR REPLACE FUNCTION signIn(
    input_username varchar,
    input_password varchar
) RETURNS VARCHAR AS $$
DECLARE
    stored_password varchar;
    user_id varchar;
BEGIN
    -- Lấy mật khẩu đã mã hóa và ID người dùng từ cơ sở dữ liệu
    SELECT password, id INTO stored_password, user_id
    FROM public.users
    WHERE username = input_username;

    IF stored_password IS NULL THEN
        RAISE NOTICE 'Email bạn nhập không kết nối với tài khoản nào.';
        RETURN NULL;
    END IF;

    -- So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
    IF NOT md5(input_password) = stored_password THEN
        RAISE NOTICE 'Sai mật khẩu';
        RETURN NULL;
    END IF;

    RAISE NOTICE 'Đăng nhập thành công';
    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Hàm xem profile một người theo username
CREATE OR REPLACE FUNCTION view_profile(
    user_id varchar
) RETURNS TABLE (
    id varchar,
    username varchar,
    password varchar,
    email varchar,
    first_name varchar,
    last_name varchar,
    role public.user_role,
    created_at timestamp,
    is_active boolean,
    phone varchar,
    address varchar,
    image varchar
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE public.users.id = user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    RETURN QUERY
    SELECT 
        public.users.id, 
        public.users.username, 
        public.users.password, 
        public.users.email, 
        public.users.first_name, 
        public.users.last_name, 
        public.users.role, 
        public.users.created_at,
        public.users.is_active,
        public.users.phone,
        public.users.address,
        public.users.image
    FROM public.users
    WHERE public.users.id = user_id;
END;
$$ LANGUAGE plpgsql;


-- Hàm tìm một người theo email

CREATE OR REPLACE FUNCTION find_by_email(
    user_email varchar
) RETURNS TABLE (
    id varchar,
    username varchar,
    password varchar,
    email varchar,
    first_name varchar,
    last_name varchar,
    role public.user_role,
    created_at timestamp,
    is_active boolean,
    -- account_type public.account_type,
    -- code_id varchar,
    -- code_expired date,
    phone varchar,
    address varchar,
    image varchar
) AS $$
BEGIN
    -- Trả về thông tin của người dùng cụ thể dựa trên email
    RETURN QUERY
    SELECT 
        public.users.id, 
        public.users.username, 
        public.users.password, 
        public.users.email, 
        public.users.first_name, 
        public.users.last_name, 
        public.users.role, 
        public.users.created_at,
        public.users.is_active,
        -- public.users.account_type,
        -- public.users.code_id,
        -- public.users.code_expired,
        public.users.phone,
        public.users.address,
        public.users.image
    FROM public.users
    WHERE public.users.email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Hàm view_all_profiles không cần phân quyền
CREATE OR REPLACE FUNCTION view_all_profiles() 
RETURNS TABLE (
    id varchar,
    username varchar,
    email varchar,
    first_name varchar,
    last_name varchar,
    role public.user_role,
    created_at timestamp,
    phone varchar,
    address varchar,
    image varchar
) AS $$
BEGIN
    -- Trả về thông tin của tất cả người dùng
    RETURN QUERY
    SELECT 
        public.users.id, 
        public.users.username, 
        public.users.email, 
        public.users.first_name, 
        public.users.last_name, 
        public.users.role, 
        public.users.created_at,
        public.users.phone,
        public.users.address,
        public.users.image
    FROM public.users;
END;
$$ LANGUAGE plpgsql;

-- Hàm update_profile đơn giản chỉ cập nhật thông tin người dùng
CREATE OR REPLACE FUNCTION update_profile(
    input_user_id varchar,
    v_email varchar DEFAULT NULL,
    v_first_name varchar DEFAULT NULL,
    v_last_name varchar DEFAULT NULL,
    v_phone varchar DEFAULT NULL,
    v_address varchar DEFAULT NULL,
    v_image varchar DEFAULT NULL
) RETURNS void AS $$
BEGIN
    IF v_email IS NOT NULL AND v_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', v_email;
    END IF;

    IF v_phone IS NOT NULL AND (v_phone !~ '^[0-9]{10}$' OR v_phone !~ '^0') THEN
        RAISE EXCEPTION 'Invalid phone format: %', v_phone;
    END IF;
    
    UPDATE public.users
    SET 
        email = COALESCE(v_email, email),
        first_name = COALESCE(v_first_name, first_name),
        last_name = COALESCE(v_last_name, last_name),
        phone = COALESCE(v_phone, phone),
        address = COALESCE(v_address, address),
        image = COALESCE(v_image, image)
    WHERE id = input_user_id;
END;
$$ LANGUAGE plpgsql;

-- Test update_profile
SELECT update_profile('caroline85', 'caroline@85gmail.com', 'Caroline','Linkin','0974230803','ABC street', 'image');

-- Tạo hàm mã hóa password
CREATE OR REPLACE FUNCTION generate_password(input_text varchar) RETURNS varchar AS $$
BEGIN
    RETURN md5(input_text);  -- Hàm md5 đã có sẵn trong PostgreSQL
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION pgcrypto;
-- create or replace function public.hash_password(password varchar(255)) returns text as $$
-- begin
--     return crypt(password, gen_salt('bf'));
-- end;
-- $$ language plpgsql;

-- Tạo hàm create_account với các trường bổ sung và kiểm tra điều kiện email và phone
CREATE OR REPLACE FUNCTION create_account(
    v_username varchar,
    v_password varchar,
    v_email varchar,
    v_first_name varchar,
    v_last_name varchar,
    v_role public.user_role DEFAULT 'CUSTOMER',
    -- v_account_type public.account_type DEFAULT 'LOCAL', -- Giá trị mặc định cho account_type
    -- v_code_id varchar DEFAULT NULL,
    -- v_code_expired date DEFAULT NULL,
    v_phone varchar DEFAULT NULL,
    v_address varchar DEFAULT NULL,
    v_image varchar DEFAULT NULL
) RETURNS void AS $$
DECLARE
    hashed_password varchar;
    new_id varchar;
BEGIN
    -- Kiểm tra xem tên người dùng đã tồn tại chưa
    IF EXISTS (SELECT 1 FROM public.users WHERE username = v_username) THEN
        RAISE EXCEPTION 'Username % already exists', v_username;
    END IF;

    -- Kiểm tra xem email đã tồn tại chưa
    IF EXISTS (SELECT 1 FROM public.users WHERE email = v_email) THEN
        RAISE EXCEPTION 'Email % already exists', v_email;
    END IF;

    -- Kiểm tra định dạng email
    IF v_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', v_email;
    END IF;

    -- Kiểm tra định dạng phone (10 số, bắt đầu bằng 0)
    IF v_phone IS NOT NULL AND v_phone !~ '^[0][0-9]{9}$' THEN
        RAISE EXCEPTION 'Invalid phone format: %', v_phone;
    END IF;

    -- Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    hashed_password := generate_password(v_password); -- Gọi hàm mã hóa mật khẩu

    -- Tạo ID theo định dạng uuid.uuid4().hex
    new_id := lower(encode(gen_random_bytes(16), 'hex'));

    -- Thêm người dùng mới vào bảng users với các trường bổ sung và is_active luôn là FALSE
    INSERT INTO public.users (id, username, password, email, first_name, last_name, role, 
                              is_active,
							  -- account_type, code_id, code_expired, 
                              phone, address, image)
    VALUES (new_id, v_username, hashed_password, v_email, v_first_name, v_last_name, 
            v_role, FALSE,
			-- v_account_type, v_code_id, v_code_expired, 
            v_phone, v_address, v_image);
END;
$$ LANGUAGE plpgsql;


-- Tạo hàm đổi password
CREATE OR REPLACE FUNCTION update_password(
    input_user_id varchar,
    old_password varchar,
    new_password varchar
) RETURNS void AS $$
DECLARE
    stored_password varchar;
    encrypted_old_password varchar;
BEGIN
    SELECT password INTO stored_password 
    FROM public.users 
    WHERE id = input_user_id;

    encrypted_old_password := md5(old_password);
    
    IF stored_password != encrypted_old_password THEN
        RAISE NOTICE 'Old password is incorrect';
    END IF;
    
    UPDATE public.users
    SET password = md5(new_password)
    WHERE id = input_user_id;
END;
$$ LANGUAGE plpgsql;

-- Test hàm đổi password
-- SELECT update_password('nghia2003', '123456');

-- Tự động tạo cho người dùng một cart khi tài khoản được kích hoạt (setActive = false -> true)
-- Drop existing trigger and function
DROP TRIGGER IF EXISTS create_cart_on_user_creation ON public.users;
DROP FUNCTION IF EXISTS create_user_cart();

-- Create new function to create cart on user insertion
CREATE OR REPLACE FUNCTION create_cart_on_user_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a new cart for the newly created user
    INSERT INTO public.carts (id, customer_id, created_at)
    VALUES (lower(encode(gen_random_bytes(8), 'hex')), NEW.id, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute after user insertion
CREATE OR REPLACE TRIGGER create_user_cart
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION create_cart_on_user_creation();

-- Chỉnh sửa cột `id` của bảng `carts` thành VARCHAR(32)
ALTER TABLE public.carts
ALTER COLUMN id TYPE varchar(32);

-- Chỉnh sửa cột `id` của bảng `carts` thành VARCHAR(32)
ALTER TABLE public.cart_items
ALTER COLUMN cart_id TYPE varchar(32);


-- Hàm remove user
CREATE OR REPLACE FUNCTION remove_user(v_user_id varchar) RETURNS varchar AS $$
DECLARE
    v_cart_id varchar;
    v_user_exists boolean;
BEGIN
    -- Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = v_user_id) INTO v_user_exists;

    IF v_user_exists THEN
        -- Đặt is_active thành FALSE cho người dùng
        UPDATE public.users
        SET is_active = FALSE
        WHERE id = v_user_id;

        -- Lấy cart_id của giỏ hàng liên quan đến user
        SELECT id INTO v_cart_id
        FROM public.carts
        WHERE customer_id = v_user_id;

        -- Nếu giỏ hàng tồn tại, xóa các cart_items liên quan
        IF v_cart_id IS NOT NULL THEN
            DELETE FROM public.cart_items
            WHERE cart_id = v_cart_id;

            -- Xóa giỏ hàng của người dùng
            DELETE FROM public.carts
            WHERE id = v_cart_id;
        END IF;

        -- Trả về thông báo thành công
        RETURN 'Xóa người dùng thành công';
    ELSE
        -- Trả về thông báo người dùng không tồn tại
        RETURN 'Không tìm thấy người dùng trong cơ sở dữ liệu';
    END IF;
END;
$$ LANGUAGE plpgsql;