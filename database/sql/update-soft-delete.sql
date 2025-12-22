-- ============================================
-- Update Database for Soft Delete Feature
-- Run this in PostgreSQL Docker container
-- ============================================

-- 1. Add is_active column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added is_active column to products table';
    ELSE
        RAISE NOTICE 'Column is_active already exists';
    END IF;
END $$;

-- 2. Update existing products to be active (if any are NULL)
UPDATE products SET is_active = TRUE WHERE is_active IS NULL;

-- 3. Create index for performance

CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- 4. Verify setup
SELECT 
    'Setup Complete' as status,
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE is_active = true) as active_products,
    COUNT(*) FILTER (WHERE is_active = false) as inactive_products
FROM products;
