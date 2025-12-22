# 🌱 Database Seeding Guide

This guide explains how to populate your e-commerce database with realistic sample data.

## 📋 What's Included

The seed data includes:

- **31 Categories** - Hierarchical structure with 5 main categories and 26 sub-categories
- **20 Users** - 2 admin accounts + 18 customer accounts
- **120+ Products** - Detailed products with realistic descriptions and Unsplash images
  - Electronics (50+ products)
  - Clothing & Fashion (25+ products)
  - Home & Living (25+ products)
  - Books & Media (15+ products)
  - Sports & Outdoors (15+ products)

## 🚀 Quick Start

### Prerequisites

1. **Docker running** with PostgreSQL container
2. **PostgreSQL client tools** installed (psql command)
3. **Database created** (should already exist from your setup)

### Option 1: Windows

```batch
cd database\seed
seed.bat
```

### Option 2: Linux/Mac

```bash
cd database/seed
chmod +x seed.sh
./seed.sh
```

### Option 3: Manual (Using psql)

```bash
psql -h localhost -p 5432 -U postgres -d ecommerce -f database/seed/seed-all.sql
```

## ⚙️ Configuration

### 1. Create .env File

Create `database/.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=your_password
```

### 2. For Docker Users

If using Docker Compose, your settings might be:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
```

## 📁 File Structure

```
database/seed/
├── 01-categories.sql       # Category hierarchy
├── 02-users.sql            # Admin & customer accounts
├── 03-products-part1.sql   # Products (Electronics, Clothing)
├── 03-products-part2.sql   # Products (Home, Books, Sports)
├── seed-all.sql            # Master script (runs all)
├── seed.bat                # Windows script
├── seed.sh                 # Linux/Mac script
└── README-SEED.md          # This file
```

## 👥 Default User Accounts

### Admin Accounts

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@ecommerce.com | password123 | ADMIN |
| john_admin | john.admin@ecommerce.com | password123 | ADMIN |

### Customer Accounts

Sample customers include:
- sarah_wilson
- mike_johnson
- emma_davis
- james_brown
- olivia_garcia
- And 13 more...

**Default Password for all users:** `password123`

⚠️ **IMPORTANT:** Change admin passwords immediately in production!

## 🖼️ Product Images

All product images are from **Unsplash** (royalty-free):
- Each product has 3-5 high-quality images
- Images are stored as URLs in the `image_urls` array field
- Perfect for development and demo purposes

## 🔄 Re-seeding the Database

The seed scripts use `TRUNCATE TABLE ... CASCADE` which will:
1. Delete all existing data
2. Reset auto-increment IDs
3. Insert fresh seed data

**To re-seed:**
```bash
# Just run the seed script again
cd database/seed
seed.bat  # Windows
./seed.sh # Linux/Mac
```

## 📊 Data Statistics

After seeding, you'll have:

```sql
-- Check the data
SELECT 
    'Categories' as type, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products;
```

Expected output:
```
Categories: 31
Users: 20
Products: 120+
```

## 🎯 Category Structure

### Main Categories → Sub-Categories

**Electronics**
- Smartphones
- Laptops & Computers
- Tablets
- Audio & Headphones
- Cameras & Photography
- Gaming
- Wearables & Smartwatches

**Clothing**
- Men's Fashion
- Women's Fashion
- Kids' Fashion
- Sportswear
- Shoes
- Accessories

**Home & Living**
- Furniture
- Kitchen & Dining
- Bedding & Bath
- Home Decor
- Storage & Organization
- Lighting

**Books & Media**
- Fiction
- Non-Fiction
- Educational
- Comics & Manga
- Magazines

**Sports & Outdoors**
- Fitness Equipment
- Outdoor Gear
- Team Sports
- Water Sports
- Cycling

## 🛠️ Troubleshooting

### Error: "psql: command not found"

**Solution:** Install PostgreSQL client tools

**Windows:**
```
Download from: https://www.postgresql.org/download/windows/
Or use chocolatey: choco install postgresql
```

**Mac:**
```bash
brew install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql-client
```

### Error: "connection refused"

**Solution:** Check if Docker PostgreSQL is running

```bash
docker ps
# You should see ecommerce-db container running

# If not, start it:
docker-compose up -d postgres
```

### Error: "permission denied for table"

**Solution:** Make sure you're using a user with sufficient privileges

```sql
-- Grant privileges to your user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Error: ".env file not found"

**Solution:** Create the .env file in `database/` folder

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env

# Then edit with your credentials
```

## 🔐 Security Notes

1. **Change default passwords** before deploying to production
2. The seed passwords are **bcrypt hashed** but use the same value
3. You'll need to update `02-users.sql` with real hashed passwords
4. Never commit real passwords to version control

### To generate new password hashes:

**Node.js:**
```javascript
const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

**Online tool:**
```
https://bcrypt-generator.com/
```

## 📝 Customizing Seed Data

### Add More Products

Edit `03-products-part2.sql` and add:

```sql
INSERT INTO products (name, description, price, stock, category_id, image_urls) VALUES
(
    'Your Product Name',
    'Detailed product description here',
    99.99,
    100,
    (SELECT id FROM categories WHERE name = 'Category Name'),
    ARRAY[
        'https://images.unsplash.com/photo-xxxxx',
        'https://images.unsplash.com/photo-yyyyy',
        'https://images.unsplash.com/photo-zzzzz'
    ]
);
```

### Finding Unsplash Images

1. Go to https://unsplash.com/
2. Search for your product type
3. Click on an image
4. Copy the image URL from browser
5. Use the URL in the format: `https://images.unsplash.com/photo-XXXXX`

### Add More Categories

Edit `01-categories.sql`:

```sql
-- Add main category
INSERT INTO categories (name, parent_category_id) VALUES ('New Category', NULL);

-- Add sub-category
INSERT INTO categories (name, parent_category_id) VALUES 
    ('New Sub-Category', (SELECT id FROM categories WHERE name = 'New Category'));
```

## ✅ Verification

After seeding, verify your data:

```sql
-- Check categories
SELECT c1.name as main_category, c2.name as sub_category
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_category_id = c1.id
WHERE c1.parent_category_id IS NULL
ORDER BY c1.name, c2.name;

-- Check products by category
SELECT 
    c.name as category,
    COUNT(p.id) as product_count,
    ROUND(AVG(p.price)::numeric, 2) as avg_price
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.parent_category_id IS NOT NULL
GROUP BY c.name
ORDER BY product_count DESC;

-- Check users
SELECT username, email, role FROM users ORDER BY role DESC, username;
```

## 🎉 Next Steps

After seeding:

1. **Start your backend**: `cd backend && npm run dev`
2. **Start your frontend**: `cd frontend && npm run dev`
3. **Test login** with admin credentials
4. **Browse products** in your application
5. **Test e-commerce features** (cart, orders, etc.)

## 💡 Tips

- **Development**: Re-seed whenever you need fresh data
- **Testing**: Create separate test seed files for specific scenarios
- **Production**: Create a separate production seed with minimal data
- **Images**: Consider downloading Unsplash images locally for offline dev

## 📞 Support

If you encounter issues:

1. Check the error message in the console
2. Verify your database connection settings
3. Ensure PostgreSQL is running (`docker ps`)
4. Check the troubleshooting section above
5. Review the SQL files for any syntax errors

---

**Happy Coding! 🚀**
