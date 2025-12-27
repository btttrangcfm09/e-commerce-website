-- Add proper English tags for electronics products
-- This will improve AI matching accuracy

-- Clear existing generic tags
UPDATE products SET tags = '{}' WHERE tags IS NOT NULL;

-- Smartphones and Mobile Phones
UPDATE products
SET tags = ARRAY['phone', 'smartphone', 'mobile', 'cellular', 'android', 'ios']
WHERE LOWER(name) LIKE '%phone%' 
   OR LOWER(name) LIKE '%iphone%'
   OR LOWER(name) LIKE '%galaxy%'
   OR LOWER(name) LIKE '%pixel%'
   OR LOWER(name) LIKE '%oneplus%'
   OR LOWER(description) LIKE '%smartphone%';

-- Laptops and Computers
UPDATE products
SET tags = ARRAY['laptop', 'computer', 'notebook', 'pc', 'portable', 'workstation']
WHERE LOWER(name) LIKE '%laptop%'
   OR LOWER(name) LIKE '%macbook%'
   OR LOWER(name) LIKE '%thinkpad%'
   OR LOWER(name) LIKE '%xps%'
   OR LOWER(name) LIKE '%notebook%'
   OR LOWER(description) LIKE '%laptop%';

-- Tablets and iPads
UPDATE products
SET tags = ARRAY['tablet', 'ipad', 'portable', 'touchscreen', 'mobile']
WHERE LOWER(name) LIKE '%ipad%'
   OR LOWER(name) LIKE '%tablet%'
   OR LOWER(name) LIKE '%tab %'
   OR LOWER(description) LIKE '%tablet%';

-- Headphones and Audio
UPDATE products
SET tags = ARRAY['headphones', 'earphones', 'earbuds', 'audio', 'wireless', 'bluetooth']
WHERE LOWER(name) LIKE '%airpods%'
   OR LOWER(name) LIKE '%headphone%'
   OR LOWER(name) LIKE '%earbud%'
   OR LOWER(name) LIKE '%earphone%'
   OR LOWER(name) LIKE '%audio%'
   OR LOWER(description) LIKE '%headphone%';

-- Smartwatches
UPDATE products
SET tags = ARRAY['watch', 'smartwatch', 'wearable', 'fitness', 'tracker']
WHERE LOWER(name) LIKE '%watch%'
   OR LOWER(name) LIKE '%apple watch%'
   OR LOWER(name) LIKE '%galaxy watch%'
   OR LOWER(description) LIKE '%smartwatch%';

-- Cameras
UPDATE products
SET tags = ARRAY['camera', 'photography', 'video', 'lens', 'imaging']
WHERE LOWER(name) LIKE '%camera%'
   OR LOWER(name) LIKE '%canon%'
   OR LOWER(name) LIKE '%nikon%'
   OR LOWER(name) LIKE '%sony alpha%'
   OR LOWER(description) LIKE '%camera%';

-- Gaming products
UPDATE products
SET tags = array_cat(tags, ARRAY['gaming', 'game', 'esports'])
WHERE LOWER(name) LIKE '%gaming%'
   OR LOWER(name) LIKE '%game%'
   OR LOWER(name) LIKE '%playstation%'
   OR LOWER(name) LIKE '%xbox%'
   OR LOWER(description) LIKE '%gaming%';

-- Add brand tags (Apple)
UPDATE products
SET tags = array_cat(tags, ARRAY['apple', 'ios', 'premium'])
WHERE LOWER(name) LIKE '%apple%'
   OR LOWER(name) LIKE '%iphone%'
   OR LOWER(name) LIKE '%ipad%'
   OR LOWER(name) LIKE '%macbook%'
   OR LOWER(name) LIKE '%airpods%';

-- Add brand tags (Samsung)
UPDATE products
SET tags = array_cat(tags, ARRAY['samsung', 'galaxy', 'android'])
WHERE LOWER(name) LIKE '%samsung%'
   OR LOWER(name) LIKE '%galaxy%';

-- Add brand tags (Sony)
UPDATE products
SET tags = array_cat(tags, ARRAY['sony', 'premium'])
WHERE LOWER(name) LIKE '%sony%';

-- Add brand tags (Dell)
UPDATE products
SET tags = array_cat(tags, ARRAY['dell', 'business', 'professional'])
WHERE LOWER(name) LIKE '%dell%';

-- Add brand tags (Lenovo)
UPDATE products
SET tags = array_cat(tags, ARRAY['lenovo', 'thinkpad', 'business'])
WHERE LOWER(name) LIKE '%lenovo%'
   OR LOWER(name) LIKE '%thinkpad%';

-- Add price range tags
UPDATE products
SET tags = array_cat(tags, ARRAY['budget', 'affordable', 'cheap'])
WHERE price < 5000000;

UPDATE products
SET tags = array_cat(tags, ARRAY['mid-range', 'moderate'])
WHERE price >= 5000000 AND price < 20000000;

UPDATE products
SET tags = array_cat(tags, ARRAY['premium', 'high-end', 'expensive'])
WHERE price >= 20000000;

-- Add wireless/connectivity tags
UPDATE products
SET tags = array_cat(tags, ARRAY['wireless', 'bluetooth', 'wifi'])
WHERE LOWER(name) LIKE '%wireless%'
   OR LOWER(name) LIKE '%bluetooth%'
   OR LOWER(name) LIKE '%wifi%'
   OR LOWER(name) LIKE '%5g%'
   OR LOWER(description) LIKE '%wireless%';

-- Add color tags for common colors
UPDATE products
SET tags = array_cat(tags, ARRAY['black'])
WHERE LOWER(name) LIKE '%black%' OR LOWER(description) LIKE '%black%';

UPDATE products
SET tags = array_cat(tags, ARRAY['white'])
WHERE LOWER(name) LIKE '%white%' OR LOWER(description) LIKE '%white%';

UPDATE products
SET tags = array_cat(tags, ARRAY['silver'])
WHERE LOWER(name) LIKE '%silver%' OR LOWER(description) LIKE '%silver%';

UPDATE products
SET tags = array_cat(tags, ARRAY['blue'])
WHERE LOWER(name) LIKE '%blue%' OR LOWER(description) LIKE '%blue%';

-- Show results
SELECT 
    id,
    name,
    price,
    tags
FROM products
WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
ORDER BY id
LIMIT 20;
