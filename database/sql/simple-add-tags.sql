-- Simple script to add basic tags to products
-- Avoid Vietnamese characters to prevent encoding issues

-- Add generic tags based on product names
UPDATE products
SET tags = ARRAY['shirt', 'clothing', 'fashion']
WHERE LOWER(name) LIKE '%shirt%' OR LOWER(name) LIKE '%ao%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE products
SET tags = ARRAY['pants', 'clothing', 'fashion']
WHERE LOWER(name) LIKE '%pants%' OR LOWER(name) LIKE '%quan%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE products
SET tags = ARRAY['dress', 'clothing', 'women', 'fashion']
WHERE LOWER(name) LIKE '%dress%' OR LOWER(name) LIKE '%vay%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE products
SET tags = ARRAY['shoes', 'footwear', 'fashion']
WHERE LOWER(name) LIKE '%shoe%' OR LOWER(name) LIKE '%giay%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE products
SET tags = ARRAY['bag', 'accessory', 'fashion']
WHERE LOWER(name) LIKE '%bag%' OR LOWER(name) LIKE '%tui%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE products
SET tags = ARRAY['watch', 'accessory', 'fashion']
WHERE LOWER(name) LIKE '%watch%' OR LOWER(name) LIKE '%dong ho%'
AND (tags IS NULL OR array_length(tags, 1) IS NULL);

-- Add tags for products that still have none
UPDATE products
SET tags = ARRAY['product', 'fashion', 'item']
WHERE tags IS NULL OR array_length(tags, 1) IS NULL;

-- Show updated products
SELECT 
    id,
    name,
    price,
    tags
FROM products
ORDER BY id
LIMIT 20;
