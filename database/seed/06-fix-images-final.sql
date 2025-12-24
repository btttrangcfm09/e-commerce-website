-- ====================================
-- FINAL IMAGE FIX v3
-- ====================================
-- Fix remaining missing/duplicate images

-- TABLETS - iPad with better images
UPDATE products SET image_urls = ARRAY[
    '/images/products/1544244015-0df4b3ffc6b0.jpg',
    '/images/products/1561154464-82e9adf32764.jpg',
    '/images/products/1585790050230-5dd28404f869.jpg'
] WHERE name = 'iPad Pro 12.9" M2';

-- CAMERA ACCESSORIES - Tripod
UPDATE products SET image_urls = ARRAY[
    '/images/products/1502920917128-1aa500764cbd.jpg',
    '/images/products/1606248897732-2c5ffe759c04.jpg',
    '/images/products/1516035069371-29a1b244cc32.jpg'
] WHERE name LIKE '%Manfrotto%Tripod%';

-- KITCHEN - Dutch Oven (colorful cast iron)
UPDATE products SET image_urls = ARRAY[
    '/images/products/1556911220-bff31c812dba.jpg',
    '/images/products/1556911220-e15b29be8c8f.jpg',
    '/images/products/1604335399105-a0c585fd81a1.jpg'
] WHERE name LIKE '%Le Creuset%Dutch Oven%';

-- KITCHEN - Dinnerware (white plates)
UPDATE products SET image_urls = ARRAY[
    '/images/products/1610701596007-11502861dcfa.jpg',
    '/images/products/1556911220-e15b29be8c8f.jpg',
    '/images/products/1584536913176-a1e494fafa91.jpg'
] WHERE name LIKE '%Corelle%Dinnerware%';

-- BATH - Towels
UPDATE products SET image_urls = ARRAY[
    '/images/products/1600334129128-685c5582fd35.jpg',
    '/images/products/1584100936595-c0654b55a2e2.jpg',
    '/images/products/1562088287-f1e5e82a7c67.jpg'
] WHERE name LIKE '%Bath Towel%';

-- CANDLES
UPDATE products SET image_urls = ARRAY[
    '/images/products/1603006905003-be475563bc59.jpg',
    '/images/products/1602874801006-22632d0e7b7e.jpg',
    '/images/products/1588681664899-f142ff2dc9b1.jpg'
] WHERE name LIKE '%Yankee Candle%';

-- FITNESS - TRX Suspension
UPDATE products SET image_urls = ARRAY[
    '/images/products/1571902943202-507ec2618e8f.jpg',
    '/images/products/1598971861713-54ad16a5c2b1.jpg',
    '/images/products/1517836357463-d25dfeac3438.jpg'
] WHERE name LIKE '%TRX%Suspension%';

-- SPORTS - Soccer Ball
UPDATE products SET image_urls = ARRAY[
    '/images/products/1575361204480-aadea25e6e68.jpg',
    '/images/products/1553778263-73a83bab9b0c.jpg',
    '/images/products/1614632537423-1e6c2e7e0aae.jpg'
] WHERE name LIKE '%Adidas%Soccer Ball%' OR name LIKE '%Tango Liga%';

-- GAMING CONSOLES (fix duplicates with unique images for each)
UPDATE products SET image_urls = ARRAY[
    '/images/products/1606813907291-d86efa9b94db.jpg',
    '/images/products/1622297845775-5ff3fef71d13.jpg',
    '/images/products/1607853202273-797f1c22a38e.jpg'
] WHERE name = 'PlayStation 5';

UPDATE products SET image_urls = ARRAY[
    '/images/products/1621259182978-fbf93132d53d.jpg',
    '/images/products/1606144042614-b2417e99c4e3.jpg',
    '/images/products/1612287230202-1ff1d85d1bdf.jpg'
] WHERE name = 'Xbox Series X';

UPDATE products SET image_urls = ARRAY[
    '/images/products/1578303512597-81e6cc155b3e.jpg',
    '/images/products/1544716278-e513176f20b5.jpg',
    '/images/products/1585524797359-f8aa891ad56c.jpg'
] WHERE name LIKE '%Nintendo Switch%';

-- GAMING ACCESSORIES - Mouse
UPDATE products SET image_urls = ARRAY[
    '/images/products/1563297007-0686b7003af7.jpg',
    '/images/products/1527814050087-3793815479db.jpg',
    '/images/products/1615663245857-ac93bb7c39e7.jpg'
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
