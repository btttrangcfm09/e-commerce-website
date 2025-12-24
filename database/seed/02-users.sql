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

-- ====================================
-- ADMIN USERS
-- ====================================

INSERT INTO users (id, username, password, email, first_name, last_name, role, created_at, image, phone, address) VALUES
(
    'admin001',
    'admin',
    '$2b$10$tXtJ0Sh9u6B1pMpcZEjuIemfcDczhd4IsNQROLb9l.VQe2/v3Nwr.',
    'admin@ecommerce.com',
    'Admin',
    'System',
    'ADMIN',
    NOW(),
    'https://i.pravatar.cc/150?img=33',
    '+84901234567',
    '123 Nguyen Hue, District 1, Ho Chi Minh City'
),
(
    'admin002',
    'john_admin',
    '$2b$10$tXtJ0Sh9u6B1pMpcZEjuIemfcDczhd4IsNQROLb9l.VQe2/v3Nwr.',
    'john.admin@ecommerce.com',
    'John',
    'Smith',
    'ADMIN',
    NOW(),
    'https://i.pravatar.cc/150?img=12',
    '+84907654321',
    '456 Le Loi, District 1, Ho Chi Minh City'
);

-- ====================================
-- CUSTOMER USERS
-- ====================================

INSERT INTO users (id, username, password, email, first_name, last_name, role, created_at, image, phone, address) VALUES
-- Customer 1
(
    gen_random_uuid()::varchar,
    'sarah_wilson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'sarah.wilson@email.com',
    'Sarah',
    'Wilson',
    'CUSTOMER',
    NOW() - INTERVAL '120 days',
    'https://i.pravatar.cc/150?img=47',
    '+84912345001',
    '15 Tran Hung Dao, Hoan Kiem, Hanoi'
),
-- Customer 2
(
    gen_random_uuid()::varchar,
    'mike_johnson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'mike.johnson@email.com',
    'Michael',
    'Johnson',
    'CUSTOMER',
    NOW() - INTERVAL '110 days',
    'https://i.pravatar.cc/150?img=15',
    '+84912345002',
    '28 Vo Van Tan, District 3, Ho Chi Minh City'
),
-- Customer 3
(
    gen_random_uuid()::varchar,
    'emma_davis',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'emma.davis@email.com',
    'Emma',
    'Davis',
    'CUSTOMER',
    NOW() - INTERVAL '95 days',
    'https://i.pravatar.cc/150?img=45',
    '+84912345003',
    '72 Nguyen Trai, Thanh Xuan, Hanoi'
),
-- Customer 4
(
    gen_random_uuid()::varchar,
    'james_brown',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'james.brown@email.com',
    'James',
    'Brown',
    'CUSTOMER',
    NOW() - INTERVAL '87 days',
    'https://i.pravatar.cc/150?img=13',
    '+84912345004',
    '91 Pasteur, District 1, Ho Chi Minh City'
),
-- Customer 5
(
    gen_random_uuid()::varchar,
    'olivia_garcia',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'olivia.garcia@email.com',
    'Olivia',
    'Garcia',
    'CUSTOMER',
    NOW() - INTERVAL '75 days',
    'https://i.pravatar.cc/150?img=44',
    '+84912345005',
    '34 Ba Trieu, Hoan Kiem, Hanoi'
),
-- Customer 6
(
    gen_random_uuid()::varchar,
    'william_miller',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'william.miller@email.com',
    'William',
    'Miller',
    'CUSTOMER',
    NOW() - INTERVAL '68 days',
    'https://i.pravatar.cc/150?img=14',
    '+84912345006',
    '56 Cach Mang Thang Tam, District 10, Ho Chi Minh City'
),
-- Customer 7
(
    gen_random_uuid()::varchar,
    'sophia_martinez',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'sophia.martinez@email.com',
    'Sophia',
    'Martinez',
    'CUSTOMER',
    NOW() - INTERVAL '61 days',
    'https://i.pravatar.cc/150?img=48',
    '+84912345007',
    '88 Hang Bong, Hoan Kiem, Hanoi'
),
-- Customer 8
(
    gen_random_uuid()::varchar,
    'robert_taylor',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'robert.taylor@email.com',
    'Robert',
    'Taylor',
    'CUSTOMER',
    NOW() - INTERVAL '55 days',
    'https://i.pravatar.cc/150?img=52',
    '+84912345008',
    '123 Hai Ba Trung, District 3, Ho Chi Minh City'
),
-- Customer 9
(
    gen_random_uuid()::varchar,
    'isabella_anderson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'isabella.anderson@email.com',
    'Isabella',
    'Anderson',
    'CUSTOMER',
    NOW() - INTERVAL '48 days',
    'https://i.pravatar.cc/150?img=49',
    '+84912345009',
    '45 Ly Thuong Kiet, Hoan Kiem, Hanoi'
),
-- Customer 10
(
    gen_random_uuid()::varchar,
    'david_thomas',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'david.thomas@email.com',
    'David',
    'Thomas',
    'CUSTOMER',
    NOW() - INTERVAL '42 days',
    'https://i.pravatar.cc/150?img=59',
    '+84912345010',
    '67 Nguyen Hue, District 1, Ho Chi Minh City'
),
-- Customer 11
(
    gen_random_uuid()::varchar,
    'mia_jackson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'mia.jackson@email.com',
    'Mia',
    'Jackson',
    'CUSTOMER',
    NOW() - INTERVAL '35 days',
    'https://i.pravatar.cc/150?img=41',
    '+84912345011',
    '99 Hoang Hoa Tham, Ba Dinh, Hanoi'
),
-- Customer 12
(
    gen_random_uuid()::varchar,
    'daniel_white',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'daniel.white@email.com',
    'Daniel',
    'White',
    'CUSTOMER',
    NOW() - INTERVAL '28 days',
    'https://i.pravatar.cc/150?img=17',
    '+84912345012',
    '111 Dien Bien Phu, Binh Thanh, Ho Chi Minh City'
),
-- Customer 13
(
    gen_random_uuid()::varchar,
    'charlotte_harris',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'charlotte.harris@email.com',
    'Charlotte',
    'Harris',
    'CUSTOMER',
    NOW() - INTERVAL '21 days',
    'https://i.pravatar.cc/150?img=43',
    '+84912345013',
    '22 Tay Son, Dong Da, Hanoi'
),
-- Customer 14
(
    gen_random_uuid()::varchar,
    'matthew_clark',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'matthew.clark@email.com',
    'Matthew',
    'Clark',
    'CUSTOMER',
    NOW() - INTERVAL '14 days',
    'https://i.pravatar.cc/150?img=68',
    '+84912345014',
    '55 Phan Xich Long, Phu Nhuan, Ho Chi Minh City'
),
-- Customer 15
(
    gen_random_uuid()::varchar,
    'amelia_lewis',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'amelia.lewis@email.com',
    'Amelia',
    'Lewis',
    'CUSTOMER',
    NOW() - INTERVAL '10 days',
    'https://i.pravatar.cc/150?img=20',
    '+84912345015',
    '77 Kim Ma, Ba Dinh, Hanoi'
),
-- Customer 16
(
    gen_random_uuid()::varchar,
    'joseph_robinson',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'joseph.robinson@email.com',
    'Joseph',
    'Robinson',
    'CUSTOMER',
    NOW() - INTERVAL '7 days',
    'https://i.pravatar.cc/150?img=51',
    '+84912345016',
    '88 Tran Quoc Toan, District 3, Ho Chi Minh City'
),
-- Customer 17
(
    gen_random_uuid()::varchar,
    'harper_walker',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'harper.walker@email.com',
    'Harper',
    'Walker',
    'CUSTOMER',
    NOW() - INTERVAL '5 days',
    'https://i.pravatar.cc/150?img=23',
    '+84912345017',
    '33 Giang Vo, Dong Da, Hanoi'
),
-- Customer 18
(
    gen_random_uuid()::varchar,
    'benjamin_hall',
    '$2b$10$1G4ROpp/s06hLfSqsWQsGeceCAstoOZLi0nD47UT7TI0DtEKJltb6',
    'benjamin.hall@email.com',
    'Benjamin',
    'Hall',
    'CUSTOMER',
    NOW() - INTERVAL '3 days',
    'https://i.pravatar.cc/150?img=60',
    '+84912345018',
    '44 Nguyen Thi Minh Khai, District 1, Ho Chi Minh City'
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
