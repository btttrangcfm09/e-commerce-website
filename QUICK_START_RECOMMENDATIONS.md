# 🚀 Quick Start - Smart Recommendations

## ⚡ 3 BƯỚC ĐỂ BẮT ĐẦU

### 📦 Bước 1: Setup Database (5 phút)

```bash
cd d:\e-commerce-website\database\sql

# Bước 1.1: Tạo tables cho recommendations
psql -U postgres -d your_database_name -f 006-product-recommendations.sql

# Bước 1.2: Thêm tags cho products (QUAN TRỌNG!)
psql -U postgres -d your_database_name -f add-electronics-tags.sql
```

**✅ File `add-electronics-tags.sql` sẽ tự động thêm tags tiếng Anh cho:**
- ✅ 120+ products đã có trong database
- ✅ Smartphones (iPhone, Galaxy, Pixel, OnePlus...)
- ✅ Laptops (MacBook, Dell XPS, ASUS ROG...)
- ✅ Tablets (iPad, Galaxy Tab...)
- ✅ Audio (Sony, Bose, AirPods...)
- ✅ Cameras (Canon, Sony, Fujifilm...)
- ✅ Gaming (PS5, Xbox, Nintendo Switch...)
- ✅ Watches (Apple Watch, Samsung Galaxy Watch...)
- ✅ Clothing & Fashion items

**Verify tags đã được thêm:**
```sql
SELECT id, name, price, tags 
FROM products 
WHERE tags IS NOT NULL 
ORDER BY id 
LIMIT 20;
```

Expected output:
```
 id |          name           |  price   |                    tags
----+-------------------------+----------+--------------------------------------------
  1 | iPhone 15 Pro Max 256GB | 1199.99  | {phone,smartphone,mobile,...,apple,ios,...}
  2 | Samsung Galaxy S24 Ultra| 1099.99  | {phone,smartphone,mobile,...,samsung,galaxy,...}
  3 | Google Pixel 8 Pro      | 899.99   | {phone,smartphone,mobile,...}
  ...
```

---

### 🔧 Bước 2: Start Backend & Frontend

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd frontend
npm run dev
```

---

### 🎯 Bước 3: Test Recommendations

1. **Mở trình duyệt:** `http://localhost:5173`

2. **Vào trang sản phẩm bất kỳ:**
   - Click vào sản phẩm (ví dụ: iPhone 15 Pro Max)
   - URL: `http://localhost:5173/products/1`

3. **Cuộn xuống → Thấy:**
   - ✅ Section **"Khách hàng cũng thích"** (8 sản phẩm tương tự)
   - ✅ Section **"Sản phẩm bạn đã xem"** (nếu đã xem sản phẩm khác)

4. **Kiểm tra Console:**
   ```
   GET /api/recommendations/product/1?limit=8 → 200 OK
   POST /api/recommendations/track-view → 200 OK
   ```

---

## 📊 Dữ Liệu Có Sẵn

Bạn đã có **120+ products** với categories:

### Electronics (30+ products):
- **Smartphones:** iPhone 15 Pro Max, Galaxy S24 Ultra, Pixel 8 Pro, OnePlus 12
- **Laptops:** MacBook Pro M3, Dell XPS 15, ASUS ROG G14, Lenovo ThinkPad
- **Tablets:** iPad Pro 12.9", Galaxy Tab S9+, iPad Air
- **Audio:** Sony WH-1000XM5, AirPods Pro, Bose QC45, JBL Flip 6
- **Cameras:** Canon R6 II, Sony A7 IV, Fujifilm X-T5, GoPro 12
- **Gaming:** PS5, Xbox Series X, Nintendo Switch OLED
- **Watches:** Apple Watch 9, Galaxy Watch 6, Fitbit Charge 6

### Clothing (40+ products):
- **Men's Fashion:** Levi's 501 Jeans, Nike T-Shirts, North Face Jackets
- **Women's Fashion:** Lululemon Leggings, Zara Dresses, Everlane Sweaters
- **Kids' Fashion:** Gap T-Shirts, Carter's Pajamas, Nike Sneakers
- **Sportswear:** Under Armour Shorts, Adidas Compression Shirts
- **Shoes:** Nike Air Max, Adidas Ultraboost, Converse, Timberland
- **Accessories:** Ray-Ban Sunglasses, Fossil Watches, Michael Kors Bags

### Home & Living (20+ products)
### Books & Media (10+ products)
### Sports & Outdoors (10+ products)

---

## 🧪 Test Scenarios

### Test 1: Similar Products (Cùng category)
```
User xem: iPhone 15 Pro Max ($1,199)
Expected recommendations:
- ✅ Samsung Galaxy S24 Ultra ($1,099) - same category, similar price
- ✅ Google Pixel 8 Pro ($899) - same category, lower price
- ✅ OnePlus 12 ($799) - same category
Score based on: category (40pts) + price range (30pts) + tags (up to 30pts)
```

### Test 2: Tags Matching
```
User xem: MacBook Pro 14" (tags: laptop, computer, apple, premium)
Expected recommendations:
- ✅ iPad Pro (tags: tablet, apple, premium) - matching: apple, premium
- ✅ Dell XPS 15 (tags: laptop, computer, premium) - matching: laptop, computer, premium
- ✅ Apple Watch (tags: watch, apple, premium) - matching: apple, premium
```

### Test 3: Price Range Matching
```
User xem: Product với price $500
Expected recommendations có price trong range:
- $350 - $650 (70% - 130% of $500)
```

### Test 4: Personalized (Sau khi xem nhiều sản phẩm)
```
User đã xem:
- 3x Laptops (category: "Laptops & Computers")
- 2x Phones (tags: "smartphone", "mobile")
- 1x Tablet (tags: "tablet", "portable")

Expected recommendations:
- ✅ More laptops (high score from category match)
- ✅ Accessories for phones/laptops
- ✅ Related electronics
```

---

## 🎯 API Endpoints

### 1. Main Endpoint (Dùng trong ProductDetail page)
```bash
GET /api/recommendations/product/1?limit=8

Response:
{
  "success": true,
  "count": 8,
  "products": [
    {
      "product_id": 2,
      "product_name": "Samsung Galaxy S24 Ultra",
      "product_price": 1099.99,
      "product_image_urls": [...],
      "category_name": "Smartphones",
      "relevance_score": 85
    },
    ...
  ],
  "recommendationType": "mixed",
  "title": "Khách hàng cũng thích"
}
```

### 2. Similar Products Only
```bash
GET /api/recommendations/similar/1?limit=8
```

### 3. Bought Together
```bash
GET /api/recommendations/bought-together/1?limit=4
```

### 4. Track View (Auto-called)
```bash
POST /api/recommendations/track-view
Body: { "productId": 1 }
```

---

## 🔍 Verify Setup

### Check Database Tables
```sql
-- Check recommendations tables exist
\dt product_views
\dt product_similarities

-- Check indexes
\di idx_product_views*

-- Check tags added
SELECT COUNT(*) FROM products WHERE tags IS NOT NULL;
-- Expected: 120+
```

### Check Backend Routes
```bash
# Should show recommendation routes
curl http://localhost:3000/api/recommendations/product/1
```

### Check Frontend Components
```bash
# Files should exist:
frontend/src/services/recommendations.js
frontend/src/hooks/useRecommendations.js
frontend/src/components/features/recommendations/ProductRecommendations.jsx
frontend/src/components/features/recommendations/RecommendationCard.jsx
```

---

## ❓ Troubleshooting

### Issue: "No recommendations shown"

**Check 1: Tags có được thêm không?**
```sql
SELECT id, name, tags FROM products LIMIT 5;
```
If tags = `{}` or `NULL` → Chạy lại `add-electronics-tags.sql`

**Check 2: API có hoạt động không?**
```bash
curl http://localhost:3000/api/recommendations/product/1
```

**Check 3: Console có errors không?**
- F12 → Console tab
- Network tab → Check API calls

### Issue: "Tags not working"

**Solution: Re-run tags script**
```bash
cd database/sql
psql -U postgres -d your_database_name -f add-electronics-tags.sql
```

### Issue: "Recommendations không liên quan"

**Check similarity scoring:**
```sql
-- Debug query to see why products match
SELECT 
    p.id,
    p.name,
    p.category_id,
    p.price,
    p.tags,
    -- Same category score
    CASE WHEN p.category_id = (SELECT category_id FROM products WHERE id = 1) 
         THEN 40 ELSE 0 END as cat_score,
    -- Price range score
    CASE WHEN p.price BETWEEN 
         (SELECT price * 0.7 FROM products WHERE id = 1) AND 
         (SELECT price * 1.3 FROM products WHERE id = 1)
         THEN 30 ELSE 0 END as price_score
FROM products p
WHERE p.id != 1 AND p.is_active = true
LIMIT 10;
```

---

## 🎉 Success Checklist

- [ ] Database migration chạy thành công (006-product-recommendations.sql)
- [ ] Tags đã được thêm (add-electronics-tags.sql)
- [ ] Backend đang chạy (port 3000)
- [ ] Frontend đang chạy (port 5173)
- [ ] Vào product detail page → thấy "Khách hàng cũng thích" section
- [ ] Click vào recommended product → chuyển trang đúng
- [ ] Network tab: API calls return 200 OK
- [ ] Console: Không có errors

---

## 📚 Đọc Thêm

Xem file chi tiết: [RECOMMENDATIONS_GUIDE.md](RECOMMENDATIONS_GUIDE.md)

**Happy Testing! 🚀**
