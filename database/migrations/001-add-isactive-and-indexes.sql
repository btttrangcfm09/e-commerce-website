-- ====================================
-- MIGRATION: Add is_active and indexes
-- ====================================
-- This migration adds:
-- 1. is_active column to orders table
-- 2. Indexes for performance on is_active columns

\echo '========================================='
\echo 'RUNNING MIGRATION: Add is_active & indexes'
\echo '========================================='
\echo ''

-- ====================================
-- STEP 1: Add is_active to orders
-- ====================================
\echo '>>> Step 1: Adding is_active to orders table...'

-- Check if column already exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE orders ADD COLUMN is_active BOOLEAN DEFAULT true;
        \echo '✓ Added is_active column to orders';
    ELSE
        \echo '✓ is_active column already exists in orders';
    END IF;
END $$;

\echo ''

-- ====================================
-- STEP 2: Ensure products has is_active
-- ====================================
\echo '>>> Step 2: Ensuring products has is_active...'

-- Check if column already exists in products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
        \echo '✓ Added is_active column to products';
    ELSE
        \echo '✓ is_active column already exists in products';
    END IF;
END $$;

\echo ''

-- ====================================
-- STEP 3: Set default values for existing data
-- ====================================
\echo '>>> Step 3: Setting default values for existing data...'

-- Update any NULL values in products
UPDATE products SET is_active = true WHERE is_active IS NULL;
\echo '✓ Updated products with NULL is_active';

-- Update any NULL values in orders (if column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'is_active'
    ) THEN
        UPDATE orders SET is_active = true WHERE is_active IS NULL;
        RAISE NOTICE '✓ Updated orders with NULL is_active';
    END IF;
END $$;

\echo ''

-- ====================================
-- STEP 4: Create indexes for performance
-- ====================================
\echo '>>> Step 4: Creating performance indexes...'

-- Index for products.is_active
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
\echo '✓ Created index: idx_products_is_active';

-- Index for orders.is_active
CREATE INDEX IF NOT EXISTS idx_orders_is_active ON orders(is_active);
\echo '✓ Created index: idx_orders_is_active';

-- Additional useful indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active);
\echo '✓ Created index: idx_products_category_active';

CREATE INDEX IF NOT EXISTS idx_orders_customer_active ON orders(customer_id, is_active);
\echo '✓ Created index: idx_orders_customer_active';

CREATE INDEX IF NOT EXISTS idx_orders_status_active ON orders(order_status, is_active);
\echo '✓ Created index: idx_orders_status_active';

\echo ''

-- ====================================
-- STEP 5: Verification
-- ====================================
\echo '>>> Step 5: Verifying migration...'
\echo ''

\echo 'Columns with is_active:'
SELECT 
    table_name,
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE column_name = 'is_active' 
  AND table_name IN ('products', 'orders')
ORDER BY table_name;

\echo ''
\echo 'Indexes created:'
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('products', 'orders') 
  AND indexdef LIKE '%is_active%'
ORDER BY tablename, indexname;

\echo ''
\echo '========================================='
\echo 'MIGRATION COMPLETED SUCCESSFULLY!'
\echo '========================================='
\echo ''
\echo 'Summary:'
\echo '- orders.is_active: Added with default true'
\echo '- products.is_active: Verified/Added with default true'
\echo '- Created 5 performance indexes'
\echo ''
