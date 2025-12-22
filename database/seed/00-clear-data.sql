-- ====================================
-- CLEAR ALL DATA
-- ====================================
-- This script removes all data from the database
-- Run this before seeding if you want a fresh start

\echo '========================================='
\echo 'CLEARING ALL DATABASE DATA'
\echo '========================================='
\echo ''

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Clear all tables in reverse order (to respect foreign keys)
\echo '>>> Clearing orders and related data...'
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE order_status_history CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
\echo '✓ Orders cleared'
\echo ''

\echo '>>> Clearing cart data...'
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE carts CASCADE;
\echo '✓ Carts cleared'
\echo ''

\echo '>>> Clearing inventory...'
TRUNCATE TABLE inventory CASCADE;
\echo '✓ Inventory cleared'
\echo ''

\echo '>>> Clearing products...'
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
\echo '✓ Products cleared'
\echo ''

\echo '>>> Clearing categories...'
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
\echo '✓ Categories cleared'
\echo ''

\echo '>>> Clearing users...'
TRUNCATE TABLE users CASCADE;
\echo '✓ Users cleared'
\echo ''

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

\echo '========================================='
\echo 'ALL DATA CLEARED SUCCESSFULLY!'
\echo '========================================='
\echo ''
