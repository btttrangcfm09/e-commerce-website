-- ====================================
-- SEED DATA: USERS
-- ====================================
-- This file contains sample users (admin + customers)
-- Default password for all users: "password123"

-- Clear existing data (if re-seeding)
TRUNCATE TABLE users CASCADE;

-- ====================================
-- ADMIN USERS
-- ====================================
-- Password: admin123 (bcrypt hash)
-- Note: You should change these passwords in production!

INSERT INTO users (id, username, password, email, first_name, last_name, phone, address, image, role, created_at) VALUES
(
    'admin001',
    'admin',
    '$2b$10$tXtJ0Sh9u6B1pMpcZEjuIemfcDczhd4IsNQROLb9l.VQe2/v3Nwr.',
    'admin@ecommerce.com',
    'Admin',
    'System',
    '0123456789',
    'Ha Noi, Vietnam',
    NULL,
    'ADMIN',
    NOW()
),
(
    'admin002',
    'john_admin',
    '$2b$10$tXtJ0Sh9u6B1pMpcZEjuIemfcDczhd4IsNQROLb9l.VQe2/v3Nwr.',
    'john.admin@ecommerce.com',
    'John',
    'Smith',
    '0987654321',
    'Ho Chi Minh City, Vietnam',
    NULL,
    'ADMIN',
    NOW()
);

-- ====================================
-- CUSTOMER USERS
-- ====================================

INSERT INTO users (id, username, password, email, first_name, last_name, phone, address, image, role, created_at) VALUES
-- Customer 1
(
    gen_random_uuid()::varchar,
    'sarah_wilson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'sarah.wilson@email.com',
    'Sarah',
    'Wilson',
    '0901234567',
    '123 Nguyen Hue, District 1, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '120 days'
),
-- Customer 2
(
    gen_random_uuid()::varchar,
    'mike_johnson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'mike.johnson@email.com',
    'Michael',
    'Johnson',
    '0912345678',
    '456 Le Loi, District 3, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '110 days'
),
-- Customer 3
(
    gen_random_uuid()::varchar,
    'emma_davis',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'emma.davis@email.com',
    'Emma',
    'Davis',
    '0923456789',
    '789 Tran Hung Dao, District 5, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '95 days'
),
-- Customer 4
(
    gen_random_uuid()::varchar,
    'james_brown',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'james.brown@email.com',
    'James',
    'Brown',
    '0934567890',
    '321 Hai Ba Trung, Ha Noi',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '87 days'
),
-- Customer 5
(
    gen_random_uuid()::varchar,
    'olivia_garcia',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'olivia.garcia@email.com',
    'Olivia',
    'Garcia',
    '0945678901',
    '654 Ba Trieu, Ha Noi',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '75 days'
),
-- Customer 6
(
    gen_random_uuid()::varchar,
    'william_miller',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'william.miller@email.com',
    'William',
    'Miller',
    '0956789012',
    '987 Ly Thuong Kiet, Da Nang',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '68 days'
),
-- Customer 7
(
    gen_random_uuid()::varchar,
    'sophia_martinez',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'sophia.martinez@email.com',
    'Sophia',
    'Martinez',
    '0967890123',
    '147 Tran Phu, Da Nang',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '61 days'
),
-- Customer 8
(
    gen_random_uuid()::varchar,
    'robert_taylor',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'robert.taylor@email.com',
    'Robert',
    'Taylor',
    '0978901234',
    '258 Hoang Dieu, Hue',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '55 days'
),
-- Customer 9
(
    gen_random_uuid()::varchar,
    'isabella_anderson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'isabella.anderson@email.com',
    'Isabella',
    'Anderson',
    '0989012345',
    '369 Nguyen Trai, Can Tho',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '48 days'
),
-- Customer 10
(
    gen_random_uuid()::varchar,
    'david_thomas',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'david.thomas@email.com',
    'David',
    'Thomas',
    '0990123456',
    '741 Le Duan, Nha Trang',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '42 days'
),
-- Customer 11
(
    gen_random_uuid()::varchar,
    'mia_jackson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'mia.jackson@email.com',
    'Mia',
    'Jackson',
    '0901234568',
    '852 Vo Van Tan, District 3, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '35 days'
),
-- Customer 12
(
    gen_random_uuid()::varchar,
    'daniel_white',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'daniel.white@email.com',
    'Daniel',
    'White',
    '0912345679',
    '963 Phan Chu Trinh, Vung Tau',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '28 days'
),
-- Customer 13
(
    gen_random_uuid()::varchar,
    'charlotte_harris',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'charlotte.harris@email.com',
    'Charlotte',
    'Harris',
    '0923456780',
    '159 Quang Trung, Bien Hoa',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '21 days'
),
-- Customer 14
(
    gen_random_uuid()::varchar,
    'matthew_clark',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'matthew.clark@email.com',
    'Matthew',
    'Clark',
    '0934567891',
    '753 Le Hong Phong, District 10, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '14 days'
),
-- Customer 15
(
    gen_random_uuid()::varchar,
    'amelia_lewis',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'amelia.lewis@email.com',
    'Amelia',
    'Lewis',
    '0945678902',
    '486 Cach Mang Thang Tam, District 3, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '10 days'
),
-- Customer 16
(
    gen_random_uuid()::varchar,
    'joseph_robinson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'joseph.robinson@email.com',
    'Joseph',
    'Robinson',
    '0956789013',
    '357 Dong Khoi, District 1, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '7 days'
),
-- Customer 17
(
    gen_random_uuid()::varchar,
    'harper_walker',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'harper.walker@email.com',
    'Harper',
    'Walker',
    '0967890124',
    '951 Ham Nghi, District 1, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '5 days'
),
-- Customer 18
(
    gen_random_uuid()::varchar,
    'benjamin_hall',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'benjamin.hall@email.com',
    'Benjamin',
    'Hall',
    '0978901235',
    '246 Pasteur, District 1, HCMC',
    NULL,
    'CUSTOMER',
    NOW() - INTERVAL '3 days'
);

-- ====================================
-- VERIFICATION
-- ====================================
SELECT 
    role,
    COUNT(*) as user_count
FROM users
GROUP BY role;

SELECT 
    username,
    email,
    first_name || ' ' || last_name as full_name,
    role
FROM users
ORDER BY role DESC, username;
