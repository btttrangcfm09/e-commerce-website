-- ====================================
-- FINAL IMAGE FIX v3
-- ====================================
-- Fix remaining missing/duplicate images

-- TABLETS - iPad with better images
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    'https://images.unsplash.com/photo-1585790050230-5dd28404f869?w=600&q=80'
] WHERE name = 'iPad Pro 12.9" M2';

-- CAMERA ACCESSORIES - Tripod
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    'https://images.unsplash.com/photo-1606248897732-2c5ffe759c04?w=600&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'
] WHERE name LIKE '%Manfrotto%Tripod%';

-- KITCHEN - Dutch Oven (colorful cast iron)
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&q=80'
] WHERE name LIKE '%Le Creuset%Dutch Oven%';

-- KITCHEN - Dinnerware (white plates)
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80',
    'https://images.unsplash.com/photo-1584536913176-a1e494fafa91?w=600&q=80'
] WHERE name LIKE '%Corelle%Dinnerware%';

-- BATH - Towels
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80',
    'https://images.unsplash.com/photo-1562088287-f1e5e82a7c67?w=600&q=80'
] WHERE name LIKE '%Bath Towel%';

-- CANDLES
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
    'https://images.unsplash.com/photo-1602874801006-22632d0e7b7e?w=600&q=80',
    'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=600&q=80'
] WHERE name LIKE '%Yankee Candle%';

-- FITNESS - TRX Suspension
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
    'https://images.unsplash.com/photo-1598971861713-54ad16a5c2b1?w=600&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80'
] WHERE name LIKE '%TRX%Suspension%';

-- SPORTS - Soccer Ball
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80',
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80',
    'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=600&q=80'
] WHERE name LIKE '%Adidas%Soccer Ball%' OR name LIKE '%Tango Liga%';

-- GAMING CONSOLES (fix duplicates with unique images for each)
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
    'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80'
] WHERE name = 'PlayStation 5';

UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80'
] WHERE name = 'Xbox Series X';

UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&q=80',
    'https://images.unsplash.com/photo-1544716278-e513176f20b5?w=600&q=80',
    'https://images.unsplash.com/photo-1585524797359-f8aa891ad56c?w=600&q=80'
] WHERE name LIKE '%Nintendo Switch%';

-- GAMING ACCESSORIES - Mouse
UPDATE products SET image_urls = ARRAY[
    'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=600&q=80',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80'
] WHERE name LIKE '%Logitech G Pro%Superlight%';

-- Verification
SELECT 
    name,
    LEFT(image_urls[1]::text, 65) as first_image
FROM products 
WHERE name IN (
    'iPad Pro 12.9" M2',
    'PlayStation 5',
    'Xbox Series X',
    'Nintendo Switch OLED',
    'Logitech G Pro X Superlight',
    'Le Creuset Cast Iron Dutch Oven 5.5 Qt',
    'Adidas Tango Liga Soccer Ball'
)
ORDER BY name;

-- Check for remaining duplicates in gaming category
SELECT 
    image_urls[1] as img,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY name) as products
FROM products
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Gaming')
GROUP BY image_urls[1]
HAVING COUNT(*) > 1;
