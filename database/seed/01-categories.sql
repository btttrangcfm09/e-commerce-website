-- ====================================
-- SEED DATA: CATEGORIES
-- ====================================
-- This file contains all categories for the e-commerce store
-- Structure: Main Categories -> Sub-Categories

-- Clear existing data (if re-seeding)
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- ====================================
-- ELECTRONICS CATEGORY
-- ====================================
INSERT INTO categories (name, parent_category_id) VALUES ('Electronics', NULL);

INSERT INTO categories (name, parent_category_id) VALUES 
    ('Smartphones', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Laptops & Computers', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Tablets', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Audio & Headphones', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Cameras & Photography', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Gaming', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL)),
    ('Wearables & Smartwatches', (SELECT id FROM categories WHERE name = 'Electronics' AND parent_category_id IS NULL));

-- ====================================
-- CLOTHING CATEGORY
-- ====================================
INSERT INTO categories (name, parent_category_id) VALUES ('Clothing', NULL);

INSERT INTO categories (name, parent_category_id) VALUES 
    ('Men''s Fashion', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL)),
    ('Women''s Fashion', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL)),
    ('Kids'' Fashion', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL)),
    ('Sportswear', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL)),
    ('Shoes', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL)),
    ('Accessories', (SELECT id FROM categories WHERE name = 'Clothing' AND parent_category_id IS NULL));

-- ====================================
-- HOME & LIVING CATEGORY
-- ====================================
INSERT INTO categories (name, parent_category_id) VALUES ('Home & Living', NULL);

INSERT INTO categories (name, parent_category_id) VALUES 
    ('Furniture', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL)),
    ('Kitchen & Dining', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL)),
    ('Bedding & Bath', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL)),
    ('Home Decor', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL)),
    ('Storage & Organization', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL)),
    ('Lighting', (SELECT id FROM categories WHERE name = 'Home & Living' AND parent_category_id IS NULL));

-- ====================================
-- BOOKS & MEDIA CATEGORY
-- ====================================
INSERT INTO categories (name, parent_category_id) VALUES ('Books & Media', NULL);

INSERT INTO categories (name, parent_category_id) VALUES 
    ('Fiction', (SELECT id FROM categories WHERE name = 'Books & Media' AND parent_category_id IS NULL)),
    ('Non-Fiction', (SELECT id FROM categories WHERE name = 'Books & Media' AND parent_category_id IS NULL)),
    ('Educational', (SELECT id FROM categories WHERE name = 'Books & Media' AND parent_category_id IS NULL)),
    ('Comics & Manga', (SELECT id FROM categories WHERE name = 'Books & Media' AND parent_category_id IS NULL)),
    ('Magazines', (SELECT id FROM categories WHERE name = 'Books & Media' AND parent_category_id IS NULL));

-- ====================================
-- SPORTS & OUTDOORS CATEGORY
-- ====================================
INSERT INTO categories (name, parent_category_id) VALUES ('Sports & Outdoors', NULL);

INSERT INTO categories (name, parent_category_id) VALUES 
    ('Fitness Equipment', (SELECT id FROM categories WHERE name = 'Sports & Outdoors' AND parent_category_id IS NULL)),
    ('Outdoor Gear', (SELECT id FROM categories WHERE name = 'Sports & Outdoors' AND parent_category_id IS NULL)),
    ('Team Sports', (SELECT id FROM categories WHERE name = 'Sports & Outdoors' AND parent_category_id IS NULL)),
    ('Water Sports', (SELECT id FROM categories WHERE name = 'Sports & Outdoors' AND parent_category_id IS NULL)),
    ('Cycling', (SELECT id FROM categories WHERE name = 'Sports & Outdoors' AND parent_category_id IS NULL));

-- ====================================
-- VERIFICATION
-- ====================================
-- Show all categories with hierarchy
SELECT 
    c1.id as main_id,
    c1.name as main_category,
    c2.id as sub_id,
    c2.name as sub_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_category_id = c1.id
WHERE c1.parent_category_id IS NULL
ORDER BY c1.id, c2.id;

-- Count summary
SELECT 
    COUNT(*) FILTER (WHERE parent_category_id IS NULL) as main_categories,
    COUNT(*) FILTER (WHERE parent_category_id IS NOT NULL) as sub_categories,
    COUNT(*) as total_categories
FROM categories;
