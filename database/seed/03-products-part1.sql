-- ====================================
-- SEED DATA: PRODUCTS
-- ====================================
-- This file contains 120+ realistic products with detailed descriptions and images
-- Images are from Unsplash (free to use)

-- Clear existing data (if re-seeding)
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- ====================================
-- ELECTRONICS - SMARTPHONES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'iPhone 15 Pro Max 256GB',
    'Latest flagship iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.7" Super Retina XDR display, ProMotion technology, and all-day battery life. Includes USB-C port and Dynamic Island.',
    1199.99,
    45,
    (SELECT id FROM categories WHERE name = 'Smartphones'),
    ARRAY[
        '/images/products/1695048133142-1a20484d2569.jpg',
        '/images/products/1695653422715-991ec3a0db7a.jpg',
        '/images/products/1592286927505-b0c5c9d60b36.jpg'
    ]
),
(
    'Samsung Galaxy S24 Ultra',
    'Premium Android flagship with 200MP camera, S Pen included, and AI-powered features. 6.8" Dynamic AMOLED display with 120Hz refresh rate. Snapdragon 8 Gen 3 processor, 12GB RAM.',
    1099.99,
    38,
    (SELECT id FROM categories WHERE name = 'Smartphones'),
    ARRAY[
        '/images/products/1610945415295-d9bbf067e59c.jpg',
        '/images/products/1598327105666-5b89351aff97.jpg',
        '/images/products/1511707171634-5f897ff02aa9.jpg'
    ]
),
(
    'Google Pixel 8 Pro',
    'Google''s flagship phone with Tensor G3 chip and advanced AI photography. 6.7" LTPO OLED display, 50MP triple camera system. Best-in-class software experience with 7 years of updates.',
    899.99,
    52,
    (SELECT id FROM categories WHERE name = 'Smartphones'),
    ARRAY[
        '/images/products/1598327105666-5b89351aff97.jpg',
        '/images/products/1601784551446-20c9e07cdbdb.jpg',
        '/images/products/1585060544812-6b45742d762f.jpg'
    ]
),
(
    'OnePlus 12',
    'Fast and smooth flagship with Snapdragon 8 Gen 3, 100W SUPERVOOC charging. 6.82" 120Hz AMOLED display, Hasselblad camera system. 16GB RAM for ultimate multitasking.',
    799.99,
    67,
    (SELECT id FROM categories WHERE name = 'Smartphones'),
    ARRAY[
        '/images/products/1511707171634-5f897ff02aa9.jpg',
        '/images/products/1592286927505-b0c5c9d60b36.jpg',
        '/images/products/1585060544812-6b45742d762f.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - LAPTOPS & COMPUTERS
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'MacBook Pro 14" M3 Pro',
    'Powerful laptop for creative professionals. M3 Pro chip with 11-core CPU and 14-core GPU. 18GB unified memory, 512GB SSD. Liquid Retina XDR display, up to 18 hours battery life.',
    1999.99,
    28,
    (SELECT id FROM categories WHERE name = 'Laptops & Computers'),
    ARRAY[
        '/images/products/1517336714731-489689fd1ca8.jpg',
        '/images/products/1541807084-5c52b6b3adef.jpg',
        '/images/products/1496181133206-80ce9b88a853.jpg'
    ]
),
(
    'Dell XPS 15',
    'Premium Windows laptop with Intel Core i7-13700H, NVIDIA RTX 4050. 15.6" 3.5K OLED touchscreen, 32GB DDR5 RAM, 1TB SSD. Perfect for content creation and gaming.',
    1799.99,
    35,
    (SELECT id FROM categories WHERE name = 'Laptops & Computers'),
    ARRAY[
        '/images/products/1593642632823-8f785ba67e45.jpg',
        '/images/products/1588872657578-7efd1f1555ed.jpg',
        '/images/products/1525547719571-a2d4ac8945e2.jpg'
    ]
),
(
    'ASUS ROG Zephyrus G14',
    'Compact gaming laptop with AMD Ryzen 9 7940HS and RTX 4060. 14" QHD 165Hz display, 16GB RAM, 1TB SSD. AniMe Matrix LED display on lid. Excellent portability and performance.',
    1599.99,
    24,
    (SELECT id FROM categories WHERE name = 'Laptops & Computers'),
    ARRAY[
        '/images/products/1603302576837-37561b2e2302.jpg',
        '/images/products/1625842268584-8f3296236761.jpg',
        '/images/products/1593642632823-8f785ba67e45.jpg'
    ]
),
(
    'HP Envy x360 13',
    'Versatile 2-in-1 laptop with Intel Core i5-1335U. 13.3" OLED touchscreen, 16GB RAM, 512GB SSD. 360-degree hinge, includes stylus. Perfect for students and professionals.',
    999.99,
    48,
    (SELECT id FROM categories WHERE name = 'Laptops & Computers'),
    ARRAY[
        '/images/products/1588872657578-7efd1f1555ed.jpg',
        '/images/products/1541807084-5c52b6b3adef.jpg',
        '/images/products/1525547719571-a2d4ac8945e2.jpg'
    ]
),
(
    'Lenovo ThinkPad X1 Carbon Gen 11',
    'Business ultrabook with Intel Core i7-1355U, 32GB RAM, 1TB SSD. 14" 2.8K OLED display, MIL-STD-810H durability. Enterprise-grade security features and legendary keyboard.',
    1699.99,
    31,
    (SELECT id FROM categories WHERE name = 'Laptops & Computers'),
    ARRAY[
        '/images/products/1496181133206-80ce9b88a853.jpg',
        '/images/products/1517336714731-489689fd1ca8.jpg',
        '/images/products/1593642632823-8f785ba67e45.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - TABLETS
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'iPad Pro 12.9" M2',
    'Ultimate iPad with M2 chip and Liquid Retina XDR display. 12.9" mini-LED screen, 128GB storage. Apple Pencil 2 compatible, USB-C with Thunderbolt. Perfect for creative work.',
    1099.99,
    42,
    (SELECT id FROM categories WHERE name = 'Tablets'),
    ARRAY[
        '/images/products/1585790050230-5dd28404f869.jpg',
        '/images/products/1544244015-0df4b3ffc6b0.jpg',
        '/images/products/1611532736597-de2d4265fba3.jpg'
    ]
),
(
    'Samsung Galaxy Tab S9+',
    'Premium Android tablet with Snapdragon 8 Gen 2, 12.4" Dynamic AMOLED display. S Pen included, IP68 water resistance. 8GB RAM, 128GB storage, expandable.',
    899.99,
    56,
    (SELECT id FROM categories WHERE name = 'Tablets'),
    ARRAY[
        '/images/products/1561154464-82e9adf32764.jpg',
        '/images/products/1544244015-0df4b3ffc6b0.jpg',
        '/images/products/1585790050230-5dd28404f869.jpg'
    ]
),
(
    'iPad Air 10.9"',
    'Lightweight iPad with M1 chip, 10.9" Liquid Retina display. 64GB storage, Touch ID, USB-C. Perfect balance of performance and price. Available in 5 colors.',
    599.99,
    78,
    (SELECT id FROM categories WHERE name = 'Tablets'),
    ARRAY[
        '/images/products/1611532736597-de2d4265fba3.jpg',
        '/images/products/1585790050230-5dd28404f869.jpg',
        '/images/products/1544244015-0df4b3ffc6b0.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - AUDIO & HEADPHONES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Sony WH-1000XM5',
    'Industry-leading noise canceling headphones. 30-hour battery life, premium sound quality with LDAC. Comfortable for all-day wear, multipoint connection. Quick charge: 3 min = 3 hours.',
    399.99,
    94,
    (SELECT id FROM categories WHERE name = 'Audio & Headphones'),
    ARRAY[
        '/images/products/1505740420928-5e560c06d30e.jpg',
        '/images/products/1484704849700-f032a568e944.jpg',
        '/images/products/1545127398-14699f92334b.jpg'
    ]
),
(
    'Apple AirPods Pro (2nd Gen)',
    'Premium wireless earbuds with active noise cancellation. H2 chip for exceptional sound, personalized spatial audio. 6 hours listening time, 30 hours with case. IP54 sweat and water resistant.',
    249.99,
    156,
    (SELECT id FROM categories WHERE name = 'Audio & Headphones'),
    ARRAY[
        '/images/products/1606841837239-c5a1a4a07af7.jpg',
        '/images/products/1590658268037-6bf12165a8df.jpg',
        '/images/products/1572569511254-d8f925fe2cbb.jpg'
    ]
),
(
    'Bose QuietComfort 45',
    'Legendary noise cancellation with balanced sound. 24-hour battery life, comfortable ear cushions. Aware Mode for hearing surroundings. Premium build quality.',
    329.99,
    72,
    (SELECT id FROM categories WHERE name = 'Audio & Headphones'),
    ARRAY[
        '/images/products/1484704849700-f032a568e944.jpg',
        '/images/products/1505740420928-5e560c06d30e.jpg',
        '/images/products/1545127398-14699f92334b.jpg'
    ]
),
(
    'JBL Flip 6',
    'Portable waterproof Bluetooth speaker. IP67 rated, 12 hours playtime. Bold JBL sound, PartyBoost feature to pair multiple speakers. Available in 6 vibrant colors.',
    129.99,
    145,
    (SELECT id FROM categories WHERE name = 'Audio & Headphones'),
    ARRAY[
        '/images/products/1608043152269-423dbba4e7e1.jpg',
        '/images/products/1545127398-14699f92334b.jpg',
        '/images/products/1589492477829-5e65395b66cc.jpg'
    ]
),
(
    'Shure SM7B Microphone',
    'Professional studio vocal microphone. Legendary warm and smooth sound, excellent for podcasting and streaming. Built-in pop filter, switchable bass rolloff and mid-range boost.',
    399.99,
    38,
    (SELECT id FROM categories WHERE name = 'Audio & Headphones'),
    ARRAY[
        '/images/products/1590602847861-f357a9332bbc.jpg',
        '/images/products/1589492477829-5e65395b66cc.jpg',
        '/images/products/1590658268037-6bf12165a8df.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - CAMERAS & PHOTOGRAPHY
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Canon EOS R6 Mark II',
    'Full-frame mirrorless camera with 24.2MP sensor. 40fps continuous shooting, advanced autofocus, 6K video. In-body image stabilization. Perfect for professionals and enthusiasts.',
    2499.99,
    18,
    (SELECT id FROM categories WHERE name = 'Cameras & Photography'),
    ARRAY[
        '/images/products/1516035069371-29a1b244cc32.jpg',
        '/images/products/1502920917128-1aa500764cbd.jpg',
        '/images/products/1606248897732-2c5ffe759c04.jpg'
    ]
),
(
    'Sony A7 IV',
    'Versatile hybrid camera with 33MP sensor. 4K 60p video, real-time tracking autofocus. 5-axis stabilization, dual card slots. Ideal for photo and video creators.',
    2499.99,
    22,
    (SELECT id FROM categories WHERE name = 'Cameras & Photography'),
    ARRAY[
        '/images/products/1502920917128-1aa500764cbd.jpg',
        '/images/products/1516035069371-29a1b244cc32.jpg',
        '/images/products/1606248897732-2c5ffe759c04.jpg'
    ]
),
(
    'Fujifilm X-T5',
    'Retro-styled APS-C mirrorless with 40MP sensor. Classic film simulations, in-body stabilization. Lightweight and portable. Exceptional image quality and build.',
    1699.99,
    29,
    (SELECT id FROM categories WHERE name = 'Cameras & Photography'),
    ARRAY[
        '/images/products/1606248897732-2c5ffe759c04.jpg',
        '/images/products/1502920917128-1aa500764cbd.jpg',
        '/images/products/1516035069371-29a1b244cc32.jpg'
    ]
),
(
    'GoPro HERO12 Black',
    'Ultimate action camera with 5.3K60 video, HyperSmooth 6.0 stabilization. Waterproof to 33ft, 8x slo-mo. HDR photo and video. Perfect for adventure and sports.',
    399.99,
    87,
    (SELECT id FROM categories WHERE name = 'Cameras & Photography'),
    ARRAY[
        '/images/products/1568301289194-c6f14b26daea.jpg',
        '/images/products/1606248897732-2c5ffe759c04.jpg',
        '/images/products/1502920917128-1aa500764cbd.jpg'
    ]
),
(
    'Manfrotto BeFree Advanced Tripod',
    'Travel tripod with aluminum construction. Max height 59", supports up to 17.6 lbs. Quick release plate, 4-section legs. Compact when folded. Includes ball head.',
    179.99,
    64,
    (SELECT id FROM categories WHERE name = 'Cameras & Photography'),
    ARRAY[
        '/images/products/1606093204630-c69f06d99a8d.jpg',
        '/images/products/1516035069371-29a1b244cc32.jpg',
        '/images/products/1502920917128-1aa500764cbd.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - GAMING
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'PlayStation 5',
    'Next-gen gaming console with custom AMD GPU. Ultra-fast SSD, ray tracing, 4K gaming up to 120fps. DualSense controller with haptic feedback. 825GB storage.',
    499.99,
    42,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1606144042614-b2417e99c4e3.jpg',
        '/images/products/1622297845775-5ff3fef71d13.jpg',
        '/images/products/1607853202273-797f1c22a38e.jpg'
    ]
),
(
    'Xbox Series X',
    'Most powerful Xbox ever with 12 teraflops GPU. 4K gaming at 60-120fps, 1TB custom SSD. Quick Resume for multiple games. Game Pass compatible.',
    499.99,
    38,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1621259182978-fbf93132d53d.jpg',
        '/images/products/1606144042614-b2417e99c4e3.jpg',
        '/images/products/1622297845775-5ff3fef71d13.jpg'
    ]
),
(
    'Nintendo Switch OLED',
    'Hybrid console with vibrant 7" OLED screen. Play at home or on-the-go. Enhanced audio, 64GB storage, wide adjustable stand. Includes dock for TV play.',
    349.99,
    76,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1578303512597-81e6cc155b3e.jpg',
        '/images/products/1585857198771-82762233f93f.jpg',
        '/images/products/1622297845775-5ff3fef71d13.jpg'
    ]
),
(
    'Logitech G Pro X Superlight',
    'Ultra-lightweight wireless gaming mouse at 63g. HERO 25K sensor, 70-hour battery life. Pro-grade performance, POWERPLAY compatible. Ambidextrous design.',
    159.99,
    124,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1527864550417-7fd91fc51a46.jpg',
        '/images/products/1563297007-0686b7003af7.jpg',
        '/images/products/1625948515291-69613efd103f.jpg'
    ]
),
(
    'Razer BlackWidow V4 Pro',
    'Premium mechanical gaming keyboard with Razer Green switches. RGB backlighting, programmable keys, command dial. Magnetic wrist rest, USB and audio pass-through.',
    229.99,
    67,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1595225476474-87563907a212.jpg',
        '/images/products/1587829741301-dc798b83add3.jpg',
        '/images/products/1618384887929-16ec33fab9ef.jpg'
    ]
),
(
    'SteelSeries Arctis Nova Pro Wireless',
    'Premium gaming headset with dual wireless system. Active noise cancellation, 360° spatial audio. Hot-swappable batteries, OLED base station. Multi-platform support.',
    349.99,
    45,
    (SELECT id FROM categories WHERE name = 'Gaming'),
    ARRAY[
        '/images/products/1599669454699-248893623440.jpg',
        '/images/products/1618366712010-f4ae9c647dcf.jpg',
        '/images/products/1484704849700-f032a568e944.jpg'
    ]
);

-- ====================================
-- ELECTRONICS - WEARABLES & SMARTWATCHES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Apple Watch Series 9 GPS 45mm',
    'Advanced health and fitness tracking. Always-On Retina display, S9 chip, double tap gesture. Blood oxygen, ECG, sleep tracking. Crash detection, emergency SOS.',
    429.99,
    134,
    (SELECT id FROM categories WHERE name = 'Wearables & Smartwatches'),
    ARRAY[
        '/images/products/1579586337278-3befd40fd17a.jpg',
        '/images/products/1434493789847-2f02dc6ca35d.jpg',
        '/images/products/1508685096489-7aacd43bd3b1.jpg'
    ]
),
(
    'Samsung Galaxy Watch 6 Classic',
    'Premium smartwatch with rotating bezel. Advanced sleep coaching, body composition analysis. 1.5" AMOLED display, Wear OS, 40-hour battery.',
    399.99,
    87,
    (SELECT id FROM categories WHERE name = 'Wearables & Smartwatches'),
    ARRAY[
        '/images/products/1617625802912-cde586faf331.jpg',
        '/images/products/1579586337278-3befd40fd17a.jpg',
        '/images/products/1434493789847-2f02dc6ca35d.jpg'
    ]
),
(
    'Fitbit Charge 6',
    'Fitness tracker with Google integration. Heart rate monitoring, GPS, stress management. 7-day battery, water resistant. Sleep tracking and daily readiness score.',
    159.99,
    156,
    (SELECT id FROM categories WHERE name = 'Wearables & Smartwatches'),
    ARRAY[
        '/images/products/1575311373937-040b8e1fd5b6.jpg',
        '/images/products/1617625802912-cde586faf331.jpg',
        '/images/products/1579586337278-3befd40fd17a.jpg'
    ]
),
(
    'Garmin Fenix 7 Pro',
    'Rugged outdoor smartwatch with solar charging. Multi-GNSS navigation, topographic maps. Advanced training metrics, up to 22 days battery. Built for adventure.',
    799.99,
    34,
    (SELECT id FROM categories WHERE name = 'Wearables & Smartwatches'),
    ARRAY[
        '/images/products/1434493789847-2f02dc6ca35d.jpg',
        '/images/products/1508685096489-7aacd43bd3b1.jpg',
        '/images/products/1579586337278-3befd40fd17a.jpg'
    ]
);

-- ====================================
-- CLOTHING - MEN'S FASHION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Levi''s 501 Original Jeans',
    'Classic straight-fit jeans in authentic denim. Button fly, iconic leather patch. Made with sustainable cotton. Available in multiple washes. True to size fit.',
    89.99,
    245,
    (SELECT id FROM categories WHERE name = 'Men''s Fashion'),
    ARRAY[
        '/images/products/1542272604-787c3835535d.jpg',
        '/images/products/1624378439575-d8705ad7ae80.jpg',
        '/images/products/1473966968600-fa801b869a1a.jpg'
    ]
),
(
    'Nike Dri-FIT Sport T-Shirt',
    'Performance athletic t-shirt with moisture-wicking technology. Lightweight, breathable fabric. Raglan sleeves for mobility. Available in 8 colors. Regular fit.',
    34.99,
    378,
    (SELECT id FROM categories WHERE name = 'Men''s Fashion'),
    ARRAY[
        '/images/products/1521572163474-6864f9cf17ab.jpg',
        '/images/products/1583743814966-8936f5b7be1a.jpg',
        '/images/products/1576566588028-4147f3842f27.jpg'
    ]
),
(
    'The North Face Thermoball Jacket',
    'Insulated jacket with synthetic ThermoBall technology. Warm even when wet, highly compressible. Water-repellent finish, secure-zip pockets. Perfect for cold weather.',
    199.99,
    124,
    (SELECT id FROM categories WHERE name = 'Men''s Fashion'),
    ARRAY[
        '/images/products/1551028719-00167b16eac5.jpg',
        '/images/products/1591047139829-d91aecb6caea.jpg',
        '/images/products/1544022613-e87ca75a784a.jpg'
    ]
),
(
    'Calvin Klein Cotton Boxer Briefs 3-Pack',
    'Premium comfort underwear in soft cotton blend. Modern stretch fabric, comfortable waistband with logo. Contoured pouch, tag-free. Black, grey, navy pack.',
    42.99,
    456,
    (SELECT id FROM categories WHERE name = 'Men''s Fashion'),
    ARRAY[
        '/images/products/1576566588028-4147f3842f27.jpg',
        '/images/products/1521572163474-6864f9cf17ab.jpg',
        '/images/products/1594938291221-94f18ceeea60.jpg'
    ]
),
(
    'Brooks Brothers Non-Iron Dress Shirt',
    'Professional dress shirt with wrinkle-free technology. 100% cotton, spread collar. Slim fit, French placket. Machine washable, no ironing needed. Multiple colors.',
    98.99,
    178,
    (SELECT id FROM categories WHERE name = 'Men''s Fashion'),
    ARRAY[
        '/images/products/1602810318383-e386cc2a3ccf.jpg',
        '/images/products/1620012253295-c15cc3e65df4.jpg',
        '/images/products/1596755094514-f87e34085b2c.jpg'
    ]
);

-- ====================================
-- CLOTHING - WOMEN'S FASHION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Lululemon Align High-Rise Leggings',
    'Buttery-soft yoga leggings with Nulu fabric. High-rise waist, no-dig waistband. Four-way stretch, sweat-wicking. Hidden pocket. Available in 25", 28", 31" inseams.',
    98.99,
    267,
    (SELECT id FROM categories WHERE name = 'Women''s Fashion'),
    ARRAY[
        '/images/products/1506629082955-511b1aa562c8.jpg',
        '/images/products/1562157873-818bc0726f68.jpg',
        '/images/products/1506629082955-511b1aa562c8.jpg'
    ]
),
(
    'Zara Floral Print Midi Dress',
    'Elegant midi dress with feminine floral pattern. V-neckline, short sleeves, flowing skirt. Side zip closure. Lightweight breathable fabric. Perfect for spring/summer.',
    79.99,
    145,
    (SELECT id FROM categories WHERE name = 'Women''s Fashion'),
    ARRAY[
        '/images/products/1515372039744-b8f02a3ae446.jpg',
        '/images/products/1496747611176-843222e1e57c.jpg',
        '/images/products/1591369822096-ffd140ec948f.jpg'
    ]
),
(
    'Everlane Cashmere Crew Sweater',
    'Luxurious 100% cashmere sweater. Classic crew neck, ribbed trim. Soft and warm, pill-resistant. Ethically sourced, transparent pricing. Available in 10 colors.',
    129.99,
    198,
    (SELECT id FROM categories WHERE name = 'Women''s Fashion'),
    ARRAY[
        '/images/products/1434389677669-e08b4cac3105.jpg',
        '/images/products/1583496661160-fb5886a0aaaa.jpg',
        '/images/products/1581338834647-b0fb40704e21.jpg'
    ]
),
(
    'Madewell High-Rise Skinny Jeans',
    'Flattering high-rise skinny jeans in stretch denim. Button fly, five-pocket styling. Comfortable all-day wear. Sustainable denim. Classic dark wash.',
    128.99,
    234,
    (SELECT id FROM categories WHERE name = 'Women''s Fashion'),
    ARRAY[
        '/images/products/1541099649105-f69ad21f3246.jpg',
        '/images/products/1582418702059-97ebafb35d09.jpg',
        '/images/products/1584370848010-d7fe6bc767ec.jpg'
    ]
),
(
    'Reformation Linen Button-Front Top',
    'Sustainable linen blouse with button-front closure. Relaxed fit, short sleeves. Breathable and lightweight. Eco-friendly materials. Perfect for warm weather.',
    88.99,
    167,
    (SELECT id FROM categories WHERE name = 'Women''s Fashion'),
    ARRAY[
        '/images/products/1618932260643-eee4a2f652a6.jpg',
        '/images/products/1485968579580-b6d095142e6e.jpg',
        '/images/products/1624206112918-f140f087f9b5.jpg'
    ]
);

-- ====================================
-- CLOTHING - KIDS' FASHION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Gap Kids Graphic T-Shirt 3-Pack',
    'Soft cotton t-shirts with fun graphics. Crew neck, short sleeves. Durable for active play. Machine washable. Available in sizes 4-14. Mix of colors and prints.',
    34.99,
    289,
    (SELECT id FROM categories WHERE name = 'Kids'' Fashion'),
    ARRAY[
        '/images/products/1519238263530-99bdd11df2ea.jpg',
        '/images/products/1503944583220-79d8926ad5e2.jpg',
        '/images/products/1622290291468-a28f7a7dc6a8.jpg'
    ]
),
(
    'Carter''s Baby Sleeper Pajamas',
    'Cozy one-piece pajamas with zip-front closure. Soft fleece fabric, non-slip feet. Available in cute animal prints. Sizes 3M-24M. Machine washable.',
    24.99,
    345,
    (SELECT id FROM categories WHERE name = 'Kids'' Fashion'),
    ARRAY[
        '/images/products/1515488042361-ee00e0ddd4e4.jpg',
        '/images/products/1519689680058-324335c77eba.jpg',
        '/images/products/1472163799897-e24c89146923.jpg'
    ]
),
(
    'Nike Kids Air Force 1 Sneakers',
    'Classic sneakers in kid-sized versions. Durable leather upper, cushioned sole. Hook-and-loop strap for easy on/off. Available in multiple colors. Sizes 10C-7Y.',
    74.99,
    234,
    (SELECT id FROM categories WHERE name = 'Kids'' Fashion'),
    ARRAY[
        '/images/products/1508609349937-5ec4ae374ebf.jpg',
        '/images/products/1514989940723-e8e51635b782.jpg',
        '/images/products/1512374382149-233c42b6a83b.jpg'
    ]
);

-- ====================================
-- CLOTHING - SPORTSWEAR
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Under Armour Tech 2.0 Shorts',
    'Lightweight training shorts with HeatGear fabric. Moisture-wicking, quick-dry. Elastic waistband with internal drawcord. Side pockets. Available in 7" and 9" inseams.',
    29.99,
    456,
    (SELECT id FROM categories WHERE name = 'Sportswear'),
    ARRAY[
        '/images/products/1591195853828-11db59a44f6b.jpg',
        '/images/products/1598032895397-b9af2f5f8ce9.jpg',
        '/images/products/1577809686012-89e8b4e477e3.jpg'
    ]
),
(
    'Adidas Techfit Compression Shirt',
    'Compression training top for enhanced performance. Four-way stretch, moisture management. Flatlock seams prevent chafing. UV protection. Long sleeves.',
    44.99,
    298,
    (SELECT id FROM categories WHERE name = 'Sportswear'),
    ARRAY[
        '/images/products/1556821840-3a63f95609a7.jpg',
        '/images/products/1571731956672-f2b94d7dd0cb.jpg',
        '/images/products/1562157873-818bc0726f68.jpg'
    ]
),
(
    'Puma Performance Running Jacket',
    'Lightweight running jacket with windCELL technology. Reflective details, thumbholes. Water-resistant, breathable. Full-zip with hood. Packable design.',
    89.99,
    167,
    (SELECT id FROM categories WHERE name = 'Sportswear'),
    ARRAY[
        '/images/products/1556821840-3a63f95609a7.jpg',
        '/images/products/1591047139829-d91aecb6caea.jpg',
        '/images/products/1591369822096-ffd140ec948f.jpg'
    ]
);

-- ====================================
-- CLOTHING - SHOES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Nike Air Max 270',
    'Lifestyle sneakers with large Air unit. Engineered mesh upper, foam midsole. All-day comfort, modern style. Available in multiple colorways. True to size.',
    149.99,
    189,
    (SELECT id FROM categories WHERE name = 'Shoes'),
    ARRAY[
        '/images/products/1542291026-7eec264c27ff.jpg',
        '/images/products/1600185365483-26d7a4cc7519.jpg',
        '/images/products/1595950653106-6c9ebd614d3a.jpg'
    ]
),
(
    'Adidas Ultraboost 22',
    'Premium running shoes with Boost cushioning. Primeknit upper, Continental rubber outsole. Energy return with every stride. Responsive and comfortable.',
    189.99,
    145,
    (SELECT id FROM categories WHERE name = 'Shoes'),
    ARRAY[
        '/images/products/1539185441755-769473a23570.jpg',
        '/images/products/1606107557195-0e29a4b5b4aa.jpg',
        '/images/products/1600185365926-3a2ce3cdb9eb.jpg'
    ]
),
(
    'Converse Chuck Taylor All Star',
    'Iconic canvas sneakers with timeless design. OrthoLite cushioning, durable rubber sole. Available in 15+ colors. High-top and low-top options.',
    59.99,
    567,
    (SELECT id FROM categories WHERE name = 'Shoes'),
    ARRAY[
        '/images/products/1607522370275-f14206abe5d3.jpg',
        '/images/products/1595341888016-a392ef81b7de.jpg',
        '/images/products/1526170375885-4d8ecf77b99f.jpg'
    ]
),
(
    'Timberland 6-Inch Premium Boots',
    'Classic waterproof boots in premium nubuck leather. Padded collar, rubber lug sole. Seam-sealed construction. Anti-fatigue technology. Iconic work boot style.',
    199.99,
    123,
    (SELECT id FROM categories WHERE name = 'Shoes'),
    ARRAY[
        '/images/products/1605348532760-6753d2c43329.jpg',
        '/images/products/1608256246200-53e635b5b65f.jpg',
        '/images/products/1520639888713-7851133b1ed0.jpg'
    ]
),
(
    'Birkenstock Arizona Sandals',
    'Comfortable two-strap sandals with cork footbed. Anatomically shaped, adjustable straps. EVA sole, skin-friendly materials. Perfect for summer. Multiple colors.',
    109.99,
    278,
    (SELECT id FROM categories WHERE name = 'Shoes'),
    ARRAY[
        '/images/products/1603487742131-4160ec999306.jpg',
        '/images/products/1562183241-b937e95585b6.jpg',
        '/images/products/1602293589930-45aad59ba3ab.jpg'
    ]
);

-- ====================================
-- CLOTHING - ACCESSORIES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Ray-Ban Aviator Classic Sunglasses',
    'Iconic aviator sunglasses with metal frame. UV protection lenses, adjustable nose pads. Comes with case and cleaning cloth. Multiple lens colors available.',
    169.99,
    234,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    ARRAY[
        '/images/products/1511499767150-a48a237f0083.jpg',
        '/images/products/1509695507497-903c140c43b0.jpg',
        '/images/products/1574258495973-f010dfbb5371.jpg'
    ]
),
(
    'Fossil Grant Leather Watch',
    'Classic chronograph watch with leather strap. Stainless steel case, mineral crystal. Water resistant to 50m. Three sub-dials. Comes in gift box.',
    149.99,
    167,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    ARRAY[
        '/images/products/1523275335684-37898b6baf30.jpg',
        '/images/products/1524805444758-089113d48a6d.jpg',
        '/images/products/1522312346375-d1a52e2b99b3.jpg'
    ]
),
(
    'Michael Kors Crossbody Bag',
    'Stylish leather crossbody with adjustable strap. Multiple compartments, gold-tone hardware. Zip closure, interior pockets. Perfect size for essentials.',
    198.99,
    145,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    ARRAY[
        '/images/products/1584917865442-de89df76afd3.jpg',
        '/images/products/1590874103328-eac38a683ce7.jpg',
        '/images/products/1566150905458-1bf1fc113f0d.jpg'
    ]
),
(
    'The North Face Borealis Backpack',
    'Versatile backpack with 28L capacity. FlexVent suspension system, padded laptop sleeve (fits 15"). Multiple pockets, water bottle pockets. Reflective details.',
    99.99,
    234,
    (SELECT id FROM categories WHERE name = 'Accessories'),
    ARRAY[
        '/images/products/1553062407-98eeb64c6a62.jpg',
        '/images/products/1577733966973-d680bffd2e80.jpg',
        '/images/products/1622260614927-9a74caa37414.jpg'
    ]
);

-- Continue in next part due to length...
