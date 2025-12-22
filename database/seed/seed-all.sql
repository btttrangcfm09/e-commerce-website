-- ====================================
-- MASTER SEED SCRIPT
-- ====================================
-- This script runs all seed files in the correct order
-- Run this file to populate your database with sample data

\echo '========================================='
\echo 'STARTING DATABASE SEED PROCESS'
\echo '========================================='
\echo ''

-- Step 1: Categories
\echo '>>> Step 1/3: Seeding Categories...'
\i '01-categories.sql'
\echo '✓ Categories seeded successfully'
\echo ''

-- Step 2: Users
\echo '>>> Step 2/3: Seeding Users...'
\i '02-users.sql'
\echo '✓ Users seeded successfully'
\echo ''

-- Step 3: Products (Part 1 and Part 2)
\echo '>>> Step 3/3: Seeding Products...'
\i '03-products-part1.sql'
\i '03-products-part2.sql'
\echo '✓ Products seeded successfully'
\echo ''

-- Final Summary
\echo '========================================='
\echo 'DATABASE SEED COMPLETED SUCCESSFULLY!'
\echo '========================================='
\echo ''
\echo 'Summary:'
SELECT 
    'Categories: ' || COUNT(*) as info
FROM categories
UNION ALL
SELECT 
    'Users: ' || COUNT(*) as info
FROM users
UNION ALL
SELECT 
    'Products: ' || COUNT(*) as info
FROM products;

\echo ''
\echo 'You can now start using your application!'
\echo '========================================='
