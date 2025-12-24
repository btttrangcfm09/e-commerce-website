-- ====================================
-- SEED DATA: PRODUCTS (PART 2)
-- ====================================
-- Continuation of products seed data

-- ====================================
-- HOME & LIVING - FURNITURE
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'IKEA KIVIK 3-Seat Sofa',
    'Comfortable and spacious sofa with deep seats. Removable, machine-washable covers. Sturdy frame, high-resilience foam cushions. Available in multiple colors and fabrics.',
    799.99,
    34,
    (SELECT id FROM categories WHERE name = 'Furniture'),
    ARRAY[
        '/images/products/1555041469-a586c61ea9bc.jpg',
        '/images/products/1493663284031-b7e3aefcae8e.jpg',
        '/images/products/1540574163026-643ea20ade25.jpg'
    ]
),
(
    'West Elm Mid-Century Coffee Table',
    'Solid wood coffee table with tapered legs. Walnut or oak finish. Storage shelf underneath. Sustainable materials. Dimensions: 48"W x 24"D x 18"H.',
    599.99,
    45,
    (SELECT id FROM categories WHERE name = 'Furniture'),
    ARRAY[
        '/images/products/1532372320572-cda25653a26d.jpg',
        '/images/products/1618219944342-824e40a13285.jpg',
        '/images/products/1556228578-8c89e6adf883.jpg'
    ]
),
(
    'Herman Miller Aeron Chair',
    'Ergonomic office chair with PostureFit support. Breathable mesh, adjustable lumbar. Multiple size options, 12-year warranty. Sustainable design, fully adjustable.',
    1449.99,
    23,
    (SELECT id FROM categories WHERE name = 'Furniture'),
    ARRAY[
        '/images/products/1580480055273-228ff5388ef8.jpg',
        '/images/products/1592078615290-033ee584e267.jpg',
        '/images/products/1611269154421-4e27233ac5c7.jpg'
    ]
),
(
    'CB2 Acacia Wood Dining Table',
    'Modern dining table seats 6-8 people. Live edge design, natural variations. Solid acacia wood, metal legs. Dimensions: 84"W x 40"D x 30"H. Easy assembly.',
    1299.99,
    18,
    (SELECT id FROM categories WHERE name = 'Furniture'),
    ARRAY[
        '/images/products/1617806118233-18e1de247200.jpg',
        '/images/products/1595428774223-ef52624120d2.jpg',
        '/images/products/1617103996702-96ff29b1c467.jpg'
    ]
);

-- ====================================
-- HOME & LIVING - KITCHEN & DINING
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Ninja Foodi 8-Quart Pressure Cooker',
    'Multi-cooker with pressure cooking and air frying. TenderCrisp technology, 14-in-1 functionality. Includes reversible rack, crisping lid. Non-stick ceramic pot.',
    199.99,
    87,
    (SELECT id FROM categories WHERE name = 'Kitchen & Dining'),
    ARRAY[
        '/images/products/1585515320310-259814833e62.jpg',
        '/images/products/1556909114-f6e7ad7d3136.jpg',
        '/images/products/1556911220-bff31c812dba.jpg'
    ]
),
(
    'KitchenAid Artisan Stand Mixer',
    'Iconic 5-quart stand mixer with 10 speeds. Includes wire whip, dough hook, flat beater. Tilt-head design, 325-watt motor. Available in 20+ colors.',
    449.99,
    124,
    (SELECT id FROM categories WHERE name = 'Kitchen & Dining'),
    ARRAY[
        '/images/products/1574269909862-7e1d70bb8078.jpg',
        '/images/products/1556909114-f6e7ad7d3136.jpg',
        '/images/products/1585515320310-259814833e62.jpg'
    ]
),
(
    'Le Creuset Cast Iron Dutch Oven 5.5 Qt',
    'Premium enameled cast iron pot. Superior heat retention and distribution. Oven-safe to 500°F. Comes with lifetime warranty. Multiple color options.',
    379.99,
    67,
    (SELECT id FROM categories WHERE name = 'Kitchen & Dining'),
    ARRAY[
        '/images/products/1556911220-bff31c812dba.jpg',
        '/images/products/1556911220-e15b29be8c8f.jpg',
        '/images/products/1604335399105-a0c585fd81a1.jpg'
    ]
),
(
    'Zwilling J.A. Henckels Knife Block Set',
    '15-piece knife set with hardwood block. German stainless steel, ice-hardened blades. Includes chef knife, bread knife, paring knives, kitchen shears. Dishwasher safe.',
    299.99,
    54,
    (SELECT id FROM categories WHERE name = 'Kitchen & Dining'),
    ARRAY[
        '/images/products/1593618998160-e34014e67546.jpg',
        '/images/products/1556911220-bff31c812dba.jpg',
        '/images/products/1585515320310-259814833e62.jpg'
    ]
),
(
    'Corelle Winter Frost Dinnerware Set',
    '18-piece dinnerware set service for 6. Break and chip resistant, lightweight. Microwave and dishwasher safe. Space-saving design. 3-year warranty.',
    79.99,
    178,
    (SELECT id FROM categories WHERE name = 'Kitchen & Dining'),
    ARRAY[
        '/images/products/1610701596007-11502861dcfa.jpg',
        '/images/products/1556911220-e15b29be8c8f.jpg',
        '/images/products/1584536913176-a1e494fafa91.jpg'
    ]
);

-- ====================================
-- HOME & LIVING - BEDDING & BATH
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Brooklinen Luxe Sheet Set',
    'Premium 480 thread count sateen sheets. 100% long-staple cotton, silky smooth finish. Deep pockets fit mattresses up to 15". Available in 10 colors. Queen size.',
    149.99,
    234,
    (SELECT id FROM categories WHERE name = 'Bedding & Bath'),
    ARRAY[
        '/images/products/1631049307264-da0ec9d70304.jpg',
        '/images/products/1522771739844-6a9f6d5f14af.jpg',
        '/images/products/1505693416388-ac5ce068fe85.jpg'
    ]
),
(
    'Parachute Down Alternative Comforter',
    'Hypoallergenic comforter with synthetic fill. 100% cotton sateen shell. Machine washable, all-season warmth. Corner loops for duvet cover. Multiple sizes.',
    249.99,
    167,
    (SELECT id FROM categories WHERE name = 'Bedding & Bath'),
    ARRAY[
        '/images/products/1540518614846-7eded433c457.jpg',
        '/images/products/1631049035182-249067d7618e.jpg',
        '/images/products/1505693416388-ac5ce068fe85.jpg'
    ]
),
(
    'Casper Memory Foam Pillow',
    'Supportive pillow with pillow-in-pillow design. Breathable outer layer, supportive inner core. Removes for customizable loft. Machine washable cover. Standard/King.',
    89.99,
    289,
    (SELECT id FROM categories WHERE name = 'Bedding & Bath'),
    ARRAY[
        '/images/products/1631049552240-59c37f38802b.jpg',
        '/images/products/1522771739844-6a9f6d5f14af.jpg',
        '/images/products/1540518614846-7eded433c457.jpg'
    ]
),
(
    'Pottery Barn Luxury Bath Towel Set',
    'Plush Turkish cotton towels. 700 GSM weight, highly absorbent. Set includes 2 bath, 2 hand, 2 wash towels. OEKO-TEX certified. Available in 12 colors.',
    119.99,
    198,
    (SELECT id FROM categories WHERE name = 'Bedding & Bath'),
    ARRAY[
        '/images/products/1600334129128-685c5582fd35.jpg',
        '/images/products/1584100936595-c0654b55a2e2.jpg',
        '/images/products/1562088287-f1e5e82a7c67.jpg'
    ]
);

-- ====================================
-- HOME & LIVING - HOME DECOR
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Anthropologie Mosaic Mirror',
    'Handcrafted mirror with colorful mosaic frame. Dimensions: 24" diameter. Keyhole hanger included. Each piece unique. Adds bohemian charm to any room.',
    198.99,
    78,
    (SELECT id FROM categories WHERE name = 'Home Decor'),
    ARRAY[
        '/images/products/1618220179428-22790b461013.jpg',
        '/images/products/1616486338812-3dadae4b4ace.jpg',
        '/images/products/1600494448655-f0476f7802e6.jpg'
    ]
),
(
    'West Elm Ceramic Table Lamp',
    'Modern table lamp with ceramic base. Includes linen shade, uses one 150W bulb. Dimensions: 18"H x 10"W. Multiple glaze color options. Perfect for side tables.',
    129.99,
    145,
    (SELECT id FROM categories WHERE name = 'Home Decor'),
    ARRAY[
        '/images/products/1513506003901-1e6a229e2d15.jpg',
        '/images/products/1550618625-4ea676a661f7.jpg',
        '/images/products/1542291026-7eec264c27ff.jpg'
    ]
),
(
    'Target Threshold Throw Pillow Set',
    'Decorative pillows with removable covers. 18"x18", cotton blend fabric. Hidden zipper closure. Set of 2 in coordinating patterns. Machine washable covers.',
    39.99,
    456,
    (SELECT id FROM categories WHERE name = 'Home Decor'),
    ARRAY[
        '/images/products/1584100936595-c0654b55a2e2.jpg',
        '/images/products/1555041469-a586c61ea9bc.jpg',
        '/images/products/1586023492125-27b2c045efd7.jpg'
    ]
),
(
    'Yankee Candle Large Jar Collection',
    'Premium scented candle with 110-150 hour burn time. High-quality paraffin wax, natural fiber wick. Includes lid. Available in 30+ fragrances. 22oz size.',
    29.99,
    567,
    (SELECT id FROM categories WHERE name = 'Home Decor'),
    ARRAY[
        '/images/products/1603006905003-be475563bc59.jpg',
        '/images/products/1602874801006-22632d0e7b7e.jpg',
        '/images/products/1588681664899-f142ff2dc9b1.jpg'
    ]
);

-- ====================================
-- HOME & LIVING - STORAGE & ORGANIZATION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'IKEA KALLAX Shelf Unit 4x4',
    'Versatile storage unit with 16 compartments. Can stand or lie horizontally. Compatible with KALLAX inserts and baskets. Easy to assemble. Dimensions: 57 7/8"x57 7/8".',
    179.99,
    67,
    (SELECT id FROM categories WHERE name = 'Storage & Organization'),
    ARRAY[
        '/images/products/1595428774223-ef52624120d2.jpg',
        '/images/products/1558618666-fcd25c85cd64.jpg',
        '/images/products/1596205250168-c3cpee87bcc1.jpg'
    ]
),
(
    'Sterilite 3-Drawer Wide Cart',
    'Rolling storage cart with clear drawers. See-through design, smooth-gliding drawers. Includes wheels and handle. Perfect for closets, garage. Dimensions: 23"L x 17"W x 26"H.',
    49.99,
    234,
    (SELECT id FROM categories WHERE name = 'Storage & Organization'),
    ARRAY[
        '/images/products/1595428774223-ef52624120d2.jpg',
        '/images/products/1558618666-fcd25c85cd64.jpg',
        '/images/products/1600494448655-f0476f7802e6.jpg'
    ]
),
(
    'Container Store Elfa Closet System',
    'Customizable closet organization system. Includes shelves, rods, drawer units. Adjustable configuration, platinum finish. Easy installation. Starter kit for 6ft closet.',
    449.99,
    45,
    (SELECT id FROM categories WHERE name = 'Storage & Organization'),
    ARRAY[
        '/images/products/1558618666-fcd25c85cd64.jpg',
        '/images/products/1595428774223-ef52624120d2.jpg',
        '/images/products/1586023492125-27b2c045efd7.jpg'
    ]
);

-- ====================================
-- HOME & LIVING - LIGHTING
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Philips Hue White & Color Starter Kit',
    'Smart LED bulbs with millions of colors. Works with Alexa, Google, HomeKit. Includes 3 bulbs and bridge. Remote control via app. Energy efficient.',
    199.99,
    145,
    (SELECT id FROM categories WHERE name = 'Lighting'),
    ARRAY[
        '/images/products/1550618625-4ea676a661f7.jpg',
        '/images/products/1513506003901-1e6a229e2d15.jpg',
        '/images/products/1558618666-fcd25c85cd64.jpg'
    ]
),
(
    'West Elm Industrial Floor Lamp',
    'Adjustable floor lamp with metal construction. Edison-style bulb (included). Three-way switch, weighted base. Height: 64". Available in bronze or brass finish.',
    179.99,
    98,
    (SELECT id FROM categories WHERE name = 'Lighting'),
    ARRAY[
        '/images/products/1513506003901-1e6a229e2d15.jpg',
        '/images/products/1550618625-4ea676a661f7.jpg',
        '/images/products/1618220179428-22790b461013.jpg'
    ]
),
(
    'LIFX Smart LED Strip 2m',
    'Color-changing LED light strip. Works without hub, WiFi enabled. 16 million colors, customizable zones. Adhesive backing, cuttable. Works with voice assistants.',
    79.99,
    234,
    (SELECT id FROM categories WHERE name = 'Lighting'),
    ARRAY[
        '/images/products/1558618666-fcd25c85cd64.jpg',
        '/images/products/1550618625-4ea676a661f7.jpg',
        '/images/products/1513506003901-1e6a229e2d15.jpg'
    ]
);

-- ====================================
-- BOOKS & MEDIA - FICTION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'The Great Gatsby by F. Scott Fitzgerald',
    'Classic American novel set in the Jazz Age. Hardcover edition with beautiful cover design. 180 pages. Timeless story of love, wealth, and the American Dream.',
    16.99,
    456,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    ARRAY[
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1495640388908-05fa85288e61.jpg'
    ]
),
(
    'Where the Crawdads Sing by Delia Owens',
    'Bestselling mystery and coming-of-age novel. Paperback, 384 pages. Story of survival, nature, and the human heart. Perfect for book clubs.',
    18.99,
    678,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    ARRAY[
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1495640388908-05fa85288e61.jpg'
    ]
),
(
    '1984 by George Orwell',
    'Dystopian masterpiece about totalitarianism. Mass market paperback, 328 pages. Essential reading, thought-provoking political fiction. Anniversary edition.',
    14.99,
    534,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    ARRAY[
        '/images/products/1495640388908-05fa85288e61.jpg',
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1512820790803-83ca734da794.jpg'
    ]
);

-- ====================================
-- BOOKS & MEDIA - NON-FICTION
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Atomic Habits by James Clear',
    'Practical guide to building good habits. Hardcover, 320 pages. Evidence-based strategies for self-improvement. New York Times bestseller.',
    27.99,
    789,
    (SELECT id FROM categories WHERE name = 'Non-Fiction'),
    ARRAY[
        '/images/products/1589829085413-56de8ae18c73.jpg',
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1544947950-fa07a98d237f.jpg'
    ]
),
(
    'Sapiens by Yuval Noah Harari',
    'Brief history of humankind from Stone Age to modern age. Paperback, 464 pages. International bestseller, thought-provoking exploration of human evolution.',
    19.99,
    567,
    (SELECT id FROM categories WHERE name = 'Non-Fiction'),
    ARRAY[
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1589829085413-56de8ae18c73.jpg',
        '/images/products/1512820790803-83ca734da794.jpg'
    ]
),
(
    'Educated by Tara Westover',
    'Powerful memoir about education and family. Paperback, 400 pages. Story of overcoming obstacles and transformation. Compelling and inspiring.',
    17.99,
    445,
    (SELECT id FROM categories WHERE name = 'Non-Fiction'),
    ARRAY[
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1589829085413-56de8ae18c73.jpg',
        '/images/products/1544947950-fa07a98d237f.jpg'
    ]
);

-- ====================================
-- BOOKS & MEDIA - EDUCATIONAL
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Clean Code by Robert C. Martin',
    'Essential guide to software craftsmanship. Hardcover, 464 pages. Best practices for writing readable, maintainable code. Must-read for programmers.',
    49.99,
    234,
    (SELECT id FROM categories WHERE name = 'Educational'),
    ARRAY[
        '/images/products/1532012197267-da84d127e765.jpg',
        '/images/products/1543002588-bfa74002ed7e.jpg',
        '/images/products/1524995997946-a1c2e315a42f.jpg'
    ]
),
(
    'The Pragmatic Programmer',
    'Classic software development guide. Paperback, 352 pages. 20th Anniversary Edition with updated content. Timeless advice for professional developers.',
    44.99,
    178,
    (SELECT id FROM categories WHERE name = 'Educational'),
    ARRAY[
        '/images/products/1543002588-bfa74002ed7e.jpg',
        '/images/products/1532012197267-da84d127e765.jpg',
        '/images/products/1524995997946-a1c2e315a42f.jpg'
    ]
),
(
    'Introduction to Algorithms (CLRS)',
    'Comprehensive algorithms textbook. Hardcover, 1312 pages. 4th Edition, covers classical and contemporary algorithms. Standard textbook for CS courses.',
    89.99,
    145,
    (SELECT id FROM categories WHERE name = 'Educational'),
    ARRAY[
        '/images/products/1524995997946-a1c2e315a42f.jpg',
        '/images/products/1532012197267-da84d127e765.jpg',
        '/images/products/1543002588-bfa74002ed7e.jpg'
    ]
);

-- ====================================
-- BOOKS & MEDIA - COMICS & MANGA
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'One Piece Vol. 1 by Eiichiro Oda',
    'Start of epic pirate adventure manga. Paperback, 216 pages. Join Luffy on his quest to become Pirate King. Best-selling manga series worldwide.',
    9.99,
    567,
    (SELECT id FROM categories WHERE name = 'Comics & Manga'),
    ARRAY[
        '/images/products/1618519764620-7403abdbdfe9.jpg',
        '/images/products/1612036782180-6f0b6cd846fe.jpg',
        '/images/products/1613376023733-0a73315d9b06.jpg'
    ]
),
(
    'Attack on Titan Vol. 1 by Hajime Isayama',
    'Dark fantasy manga phenomenon. Paperback, 200 pages. Humanity vs titans in post-apocalyptic world. Intense action and mystery.',
    11.99,
    445,
    (SELECT id FROM categories WHERE name = 'Comics & Manga'),
    ARRAY[
        '/images/products/1612036782180-6f0b6cd846fe.jpg',
        '/images/products/1618519764620-7403abdbdfe9.jpg',
        '/images/products/1613376023733-0a73315d9b06.jpg'
    ]
),
(
    'The Sandman Vol. 1 by Neil Gaiman',
    'Legendary graphic novel series. Paperback, 240 pages. Dark fantasy masterpiece, stunning artwork. Winner of multiple awards.',
    19.99,
    334,
    (SELECT id FROM categories WHERE name = 'Comics & Manga'),
    ARRAY[
        '/images/products/1613376023733-0a73315d9b06.jpg',
        '/images/products/1612036782180-6f0b6cd846fe.jpg',
        '/images/products/1618519764620-7403abdbdfe9.jpg'
    ]
);

-- ====================================
-- BOOKS & MEDIA - MAGAZINES
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'National Geographic Magazine Subscription',
    '12-month subscription (12 issues). World-class photography, in-depth stories. Science, nature, culture, and geography. Digital access included.',
    39.99,
    999,
    (SELECT id FROM categories WHERE name = 'Magazines'),
    ARRAY[
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1495640388908-05fa85288e61.jpg'
    ]
),
(
    'WIRED Magazine Annual Subscription',
    '12-month subscription. Technology, science, culture coverage. Digital edition access. Expert analysis of tech trends and innovations.',
    29.99,
    999,
    (SELECT id FROM categories WHERE name = 'Magazines'),
    ARRAY[
        '/images/products/1544947950-fa07a98d237f.jpg',
        '/images/products/1512820790803-83ca734da794.jpg',
        '/images/products/1495640388908-05fa85288e61.jpg'
    ]
);

-- ====================================
-- SPORTS & OUTDOORS - FITNESS EQUIPMENT
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Bowflex SelectTech Adjustable Dumbbells',
    'Space-saving adjustable dumbbells, 5-52.5 lbs per dumbbell. Quick weight adjustment, replaces 15 sets. Durable construction, includes storage tray.',
    549.99,
    67,
    (SELECT id FROM categories WHERE name = 'Fitness Equipment'),
    ARRAY[
        '/images/products/1517836357463-d25dfeac3438.jpg',
        '/images/products/1534438327276-14e5300c3a48.jpg',
        '/images/products/1571019613454-1cb2f99b2d8b.jpg'
    ]
),
(
    'Peloton Bike',
    'Interactive home fitness bike with live classes. 22" HD touchscreen, adjustable seat and handlebars. Access to thousands of on-demand workouts. Monthly subscription required.',
    1445.99,
    34,
    (SELECT id FROM categories WHERE name = 'Fitness Equipment'),
    ARRAY[
        '/images/products/1534438327276-14e5300c3a48.jpg',
        '/images/products/1517836357463-d25dfeac3438.jpg',
        '/images/products/1571019613454-1cb2f99b2d8b.jpg'
    ]
),
(
    'TRX Home2 Suspension Training Kit',
    'Total body resistance training system. Includes suspension trainer, door anchor, workout guide. Portable, adjustable difficulty. Over 300+ exercises possible.',
    169.99,
    178,
    (SELECT id FROM categories WHERE name = 'Fitness Equipment'),
    ARRAY[
        '/images/products/1571902943202-507ec2618e8f.jpg',
        '/images/products/1598971861713-54ad16a5c2b1.jpg',
        '/images/products/1517836357463-d25dfeac3438.jpg'
    ]
),
(
    'Concept2 Model D Indoor Rowing Machine',
    'Professional-grade rowing machine. Performance Monitor 5, adjustable footrests. Smooth, quiet operation. Separates for storage. Used by Olympians.',
    999.99,
    45,
    (SELECT id FROM categories WHERE name = 'Fitness Equipment'),
    ARRAY[
        '/images/products/1517836357463-d25dfeac3438.jpg',
        '/images/products/1571019613454-1cb2f99b2d8b.jpg',
        '/images/products/1534438327276-14e5300c3a48.jpg'
    ]
);

-- ====================================
-- SPORTS & OUTDOORS - OUTDOOR GEAR
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'REI Co-op Half Dome SL 2+ Tent',
    'Lightweight backpacking tent for 2 people. Waterproof, easy setup, 2 doors and vestibules. Pack weight 3 lbs 13 oz. Includes footprint.',
    299.99,
    89,
    (SELECT id FROM categories WHERE name = 'Outdoor Gear'),
    ARRAY[
        '/images/products/1504280390367-361c6d9f38f4.jpg',
        '/images/products/1478131143081-80f7f84ca84d.jpg',
        '/images/products/1537905569824-f89f14cceb68.jpg'
    ]
),
(
    'Osprey Atmos AG 65 Backpack',
    'Premium hiking backpack with Anti-Gravity suspension. 65L capacity, adjustable torso. Multiple pockets, rain cover included. Comfortable for multi-day trips.',
    299.99,
    124,
    (SELECT id FROM categories WHERE name = 'Outdoor Gear'),
    ARRAY[
        '/images/products/1622260614927-9a74caa37414.jpg',
        '/images/products/1553062407-98eeb64c6a62.jpg',
        '/images/products/1577733966973-d680bffd2e80.jpg'
    ]
),
(
    'Yeti Tundra 45 Cooler',
    'Rotomolded construction cooler, holds 54 cans. Bear-resistant, freezer-quality gasket. Keeps ice for days. T-latches, tie-down points. Made in USA.',
    349.99,
    67,
    (SELECT id FROM categories WHERE name = 'Outdoor Gear'),
    ARRAY[
        '/images/products/1567696153798-de0b21b72a77.jpg',
        '/images/products/1504280390367-361c6d9f38f4.jpg',
        '/images/products/1478131143081-80f7f84ca84d.jpg'
    ]
),
(
    'Black Diamond Spot 400 Headlamp',
    'Powerful LED headlamp with 400 lumens. Multiple lighting modes, red night vision. Waterproof IPX8. Includes 3 AAA batteries. Great for camping and hiking.',
    44.99,
    234,
    (SELECT id FROM categories WHERE name = 'Outdoor Gear'),
    ARRAY[
        '/images/products/1504280390367-361c6d9f38f4.jpg',
        '/images/products/1478131143081-80f7f84ca84d.jpg',
        '/images/products/1537905569824-f89f14cceb68.jpg'
    ]
);

-- ====================================
-- SPORTS & OUTDOORS - TEAM SPORTS
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Wilson Evolution Basketball',
    'Official size indoor basketball. Microfiber composite leather, superior grip. Used in high schools nationwide. Size 7 (men''s official).',
    64.99,
    234,
    (SELECT id FROM categories WHERE name = 'Team Sports'),
    ARRAY[
        '/images/products/1546519638-68e109498ffc.jpg',
        '/images/products/1519861531473-9200262188bf.jpg',
        '/images/products/1587280501635-68a0e82cd5ff.jpg'
    ]
),
(
    'Adidas Tango Liga Soccer Ball',
    'Professional training soccer ball. Machine-stitched, butyl bladder. FIFA Quality approved. Size 5 (official). Durable for all surfaces.',
    24.99,
    456,
    (SELECT id FROM categories WHERE name = 'Team Sports'),
    ARRAY[
        '/images/products/1575361204480-aadea25e6e68.jpg',
        '/images/products/1553778263-73a83bab9b0c.jpg',
        '/images/products/1614632537423-1e6c2e7e0aae.jpg'
    ]
),
(
    'Easton Ghost Fastpitch Softball Bat',
    'High-performance composite bat. Double barrel construction, balanced swing weight. 2-piece design, approved for ASA/USSSA. Drop -10.',
    299.99,
    78,
    (SELECT id FROM categories WHERE name = 'Team Sports'),
    ARRAY[
        '/images/products/1587280501635-68a0e82cd5ff.jpg',
        '/images/products/1546519638-68e109498ffc.jpg',
        '/images/products/1519861531473-9200262188bf.jpg'
    ]
);

-- ====================================
-- SPORTS & OUTDOORS - WATER SPORTS
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Intex Explorer K2 Kayak',
    'Inflatable 2-person kayak. Includes paddles, pump, bag. Removable skeg for tracking. Adjustable seats, holds up to 400 lbs. Great for lakes and rivers.',
    149.99,
    89,
    (SELECT id FROM categories WHERE name = 'Water Sports'),
    ARRAY[
        '/images/products/1544551763-46a013bb70d5.jpg',
        '/images/products/1506905925346-21bda4d32df4.jpg',
        '/images/products/1525186402429-b4ff38bedec6.jpg'
    ]
),
(
    'O''Neill Reactor 3/2mm Wetsuit',
    'Full wetsuit for surfing and water sports. FluidFlex neoprene, strategic stretch panels. Back zip entry, flatlock stitching. Men''s sizes available.',
    179.99,
    124,
    (SELECT id FROM categories WHERE name = 'Water Sports'),
    ARRAY[
        '/images/products/1506905925346-21bda4d32df4.jpg',
        '/images/products/1544551763-46a013bb70d5.jpg',
        '/images/products/1525186402429-b4ff38bedec6.jpg'
    ]
);

-- ====================================
-- SPORTS & OUTDOORS - CYCLING
-- ====================================
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Schwinn IC4 Indoor Cycling Bike',
    'Stationary bike with Bluetooth connectivity. Magnetic resistance, 40 lb flywheel. Dual pedals, adjustable seat and handlebars. Compatible with cycling apps.',
    899.99,
    54,
    (SELECT id FROM categories WHERE name = 'Cycling'),
    ARRAY[
        '/images/products/1558618666-fcd25c85cd64.jpg',
        '/images/products/1517649763962-0c623066013b.jpg',
        '/images/products/1485965120184-e220f721d03e.jpg'
    ]
),
(
    'Giro Syntax MIPS Road Helmet',
    'Lightweight road cycling helmet with MIPS technology. 25 vents, Roc Loc 5 fit system. Comfortable padding, multiple sizes. Safety certified.',
    149.99,
    167,
    (SELECT id FROM categories WHERE name = 'Cycling'),
    ARRAY[
        '/images/products/1559056199-641a0ac8b55e.jpg',
        '/images/products/1517649763962-0c623066013b.jpg',
        '/images/products/1485965120184-e220f721d03e.jpg'
    ]
),
(
    'CamelBak Podium Bike Water Bottle',
    'BPA-free cycling water bottle, 24 oz. Self-sealing jet valve, easy squeeze. Dishwasher safe, fits most cages. Available in multiple colors.',
    12.99,
    678,
    (SELECT id FROM categories WHERE name = 'Cycling'),
    ARRAY[
        '/images/products/1523362628745-0c100150b504.jpg',
        '/images/products/1517649763962-0c623066013b.jpg',
        '/images/products/1485965120184-e220f721d03e.jpg'
    ]
);

-- ====================================
-- VERIFICATION
-- ====================================
SELECT 
    c1.name as main_category,
    c2.name as sub_category,
    COUNT(p.id) as product_count,
    ROUND(AVG(p.price)::numeric, 2) as avg_price
FROM categories c1
JOIN categories c2 ON c2.parent_category_id = c1.id
LEFT JOIN products p ON p.category_id = c2.id
WHERE c1.parent_category_id IS NULL
GROUP BY c1.name, c2.name
ORDER BY c1.name, c2.name;

SELECT COUNT(*) as total_products FROM products;
