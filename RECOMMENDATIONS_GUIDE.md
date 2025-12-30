# 🎯 Smart Product Recommendations - Complete Guide

## 📋 Overview

**Smart Product Recommendations** feature fully implemented with:

## 🏗️ Architecture - Pure Backend Logic

**✅ No Database Functions/Procedures**
- All recommendation logic implemented in Node.js backend
- Database only stores data (tables, indexes)
- No stored procedures, functions, or triggers
- Pure SQL queries from application layer

**Why This Approach:**
- ✅ Business logic in application layer (easier to test)
- ✅ No database lock-in
- ✅ Better for microservices
- ✅ Version control for all logic
- ✅ Easier debugging and monitoring

**Tags & Content: English Only**
- All product tags must be in English
- All AI descriptions in English
- Consistent data format across the system

---

### ✅ Tính Năng Đã Triển Khai

1. **Similar Products** - Sản phẩm tương tự
   - Dựa trên category, tags, và price range
   - Score: 40 điểm (cùng category) + 30 điểm (price range 30%) + 5 điểm/tag matching

2. **Frequently Bought Together** - Khách hàng cũng mua
   - Phân tích lịch sử đơn hàng
   - Tìm sản phẩm thường được mua cùng

3. **Personalized Recommendations** - Gợi ý cá nhân hóa
   - Dựa trên lịch sử xem sản phẩm (30 ngày gần nhất)
   - Score: 50 điểm/view cho category + 20 điểm/view cho tag

4. **Purchase-Based Recommendations** - Dựa trên lịch sử mua
   - Phân tích sản phẩm đã mua
   - Gợi ý sản phẩm liên quan

5. **Trending Products** - Sản phẩm xu hướng
   - Dựa trên lượt xem (7 ngày) + lượt mua (30 ngày)
   - Score = views * 1 + purchases * 10

6. **Recently Viewed** - Sản phẩm đã xem gần đây
   - Theo dõi lịch sử xem của user

---

## 🗄️ Database Setup

### Bước 1: Setup Database

```bash
cd database/sql

# 1. Chạy migration để tạo bảng recommendations
psql -U postgres -d your_database_name -f 006-product-recommendations.sql

# 2. Thêm tags cho products (QUAN TRỌNG!)
psql -U postgres -d your_database_name -f add-electronics-tags.sql

# Hoặc dùng simple version:
# psql -U postgres -d your_database_name -f simple-add-tags.sql
```

**File:** `database/sql/006-product-recommendations.sql`

**Tables created:**
- `product_views` - Track product viewing history
- `product_similarities` - Precomputed similarity scores (optional)

**Note:** NO stored procedures or functions - all logic in backend!

**Indexes created:**
- `idx_product_views_user_id`
- `idx_product_views_product_id`
- `idx_product_views_viewed_at`
- `idx_product_views_user_time`

---

## 🔧 Backend Implementation

### Kiến Trúc 3 Lớp

```
Controller (HTTP) → Service (Business Logic) → Repository (Database)
```

### 1. Repository Layer

**File:** `backend/src/repositories/recommendation.repository.js`

**Các method chính:**
```javascript
// Track product view
trackProductView(userId, productId, sessionId)

// Get similar products
getSimilarProducts(productId, limit = 8)

// Get frequently bought together
getFrequentlyBoughtTogether(productId, limit = 4)

// Get personalized recommendations
getPersonalizedRecommendations(userId, limit = 8, excludeProductIds = [])

// Get purchase-based recommendations
getRecommendationsFromPurchaseHistory(userId, limit = 8)

// Get trending in category
getTrendingInCategory(categoryId, excludeProductId = null, limit = 8)

// Get recently viewed
getRecentlyViewed(userId, limit = 10)

// MAIN: Get comprehensive product page recommendations
getProductPageRecommendations(productId, userId = null, limit = 8)

// Get homepage recommendations
getHomepageRecommendations(userId = null, limit = 12)
```

### 2. Service Layer

**File:** `backend/src/services/recommendation.service.js`

**Nhiệm vụ:**
- Validation input
- Format data cho frontend
- Coordinate giữa các repository methods
- Handle errors gracefully

### 3. Controller Layer

**File:** `backend/src/controllers/client/recommendation.controller.js`

**Endpoints:**
- `POST /api/recommendations/track-view`
- `GET /api/recommendations/similar/:productId`
- `GET /api/recommendations/bought-together/:productId`
- `GET /api/recommendations/personalized`
- `GET /api/recommendations/from-purchases`
- `GET /api/recommendations/trending/:categoryId`
- `GET /api/recommendations/recently-viewed`
- `GET /api/recommendations/product/:productId` ⭐ **MAIN ENDPOINT**
- `GET /api/recommendations/homepage`

### 4. Routes

**File:** `backend/src/routes/client/recommendation.routes.js`

**Đã đăng ký trong:** `backend/src/routes/index.js`
```javascript
router.use('/recommendations', clientRecommendationRoutes);
```

### 5. Middleware (Optional)

**File:** `backend/src/middleware/track-view.middleware.js`

**Cách dùng:**
```javascript
const { trackProductView } = require('../middleware/track-view.middleware');

// Tự động track khi user xem product detail
router.get('/products/:id', trackProductView, productController.getById);
```

---

## 🎨 Frontend Implementation

### 1. API Service

**File:** `frontend/src/services/recommendations.js` ✅ Created

**Usage:**
```javascript
import recommendationService from '@/services/recommendations';

// Get product page recommendations (MAIN)
const response = await recommendationService.getProductPageRecommendations(productId, 8);

// Get similar products
const similar = await recommendationService.getSimilarProducts(productId, 8);

// Get bought together
const boughtTogether = await recommendationService.getFrequentlyBoughtTogether(productId, 4);

// Track view
await recommendationService.trackProductView(productId);
```

### 2. Custom Hook

**File:** `frontend/src/hooks/useRecommendations.js`

**Usage:**
```javascript
import { useRecommendations, useTrackProductView } from '@/hooks/useRecommendations';

// In component
const { recommendations, loading, error, metadata } = useRecommendations('product-page', {
    productId: 123,
    limit: 8
});

// Track view
const { trackView } = useTrackProductView();
trackView(productId);
```

### 3. React Components

**Files:**
- `frontend/src/components/features/recommendations/RecommendationCard.jsx`
- `frontend/src/components/features/recommendations/ProductRecommendations.jsx`
- `frontend/src/components/features/recommendations/index.js`

**Usage trong ProductDetail:**
```jsx
import { ProductRecommendations } from '@/components/features/recommendations';

// Main recommendations
<ProductRecommendations 
    type="product-page"
    params={{ productId: id }}
    limit={8}
    columns={4}
/>

// Recently viewed
<ProductRecommendations 
    type="recently-viewed"
    title="Sản phẩm bạn đã xem"
    limit={6}
    columns={6}
/>
```

### 4. Tích Hợp vào ProductDetail Page

**File:** `frontend/src/pages/client/Products/ProductDetail.jsx`

**Đã tích hợp:**
- Auto-track product view khi page load
- Hiển thị "Khách hàng cũng thích" section
- Hiển thị "Sản phẩm bạn đã xem" section

---

## 🚀 Cách Sử Dụng

### Backend APIs

#### 1. Track Product View (Auto-tracking)
```bash
POST /api/recommendations/track-view
Content-Type: application/json

{
  "productId": 123,
  "sessionId": "guest_12345" # Optional cho guest users
}
```

#### 2. Get Product Page Recommendations ⭐ MAIN
```bash
GET /api/recommendations/product/123?limit=8
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "products": [
    {
      "product_id": 45,
      "product_name": "Áo Sơ Mi Nam",
      "product_description": "...",
      "product_price": 299000,
      "product_stock": 50,
      "product_image_urls": ["/uploads/products/..."],
      "category_id": 2,
      "category_name": "Áo",
      "relevance_score": 85
    }
  ],
  "recommendationType": "mixed",
  "title": "Khách hàng cũng thích",
  "description": "Sản phẩm tương tự được người mua khác quan tâm"
}
```

#### 3. Get Similar Products
```bash
GET /api/recommendations/similar/123?limit=8
```

#### 4. Get Frequently Bought Together
```bash
GET /api/recommendations/bought-together/123?limit=4
```

#### 5. Get Personalized (Requires Auth)
```bash
GET /api/recommendations/personalized?limit=8
Authorization: Bearer <token>
```

#### 6. Get Recently Viewed (Requires Auth)
```bash
GET /api/recommendations/recently-viewed?limit=10
Authorization: Bearer <token>
```

### Frontend Components

#### 1. Cơ Bản
```jsx
<ProductRecommendations 
    type="product-page"
    params={{ productId: 123 }}
    limit={8}
/>
```

#### 2. Với Custom Title
```jsx
<ProductRecommendations 
    type="similar"
    params={{ productId: 123 }}
    title="Sản phẩm tương tự"
    description="Các sản phẩm cùng loại"
    limit={8}
    columns={4}
/>
```

#### 3. Homepage Recommendations
```jsx
<ProductRecommendations 
    type="homepage"
    limit={12}
    columns={4}
/>
```

#### 4. Trending in Category
```jsx
<ProductRecommendations 
    type="trending"
    params={{ categoryId: 2, excludeProductId: 123 }}
    title="Xu hướng trong danh mục"
    limit={8}
/>
```

---

## 🧪 Testing

### 1. Test Backend API

```bash
# Start backend
cd backend
npm start

# Test tracking
curl -X POST http://localhost:3000/api/recommendations/track-view \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'

# Test recommendations
curl http://localhost:3000/api/recommendations/product/1?limit=8
```

### 2. Test Frontend

```bash
# Start frontend
cd frontend
npm run dev

# Navigate to:
http://localhost:5173/products/1
```

**Kiểm tra:**
- ✅ Section "Khách hàng cũng thích" hiển thị
- ✅ Section "Sản phẩm bạn đã xem" hiển thị (nếu đã xem sản phẩm)
- ✅ Clicking vào recommendation card → navigate đúng
- ✅ Network tab: API calls thành công

---

## 📊 Algorithm Chi Tiết

### 1. Similar Products Algorithm

**Scoring System:**
```
Total Score = Category Score + Price Score + Tag Score

Category Score:
- Same category = 40 points
- Different category = 0 points

Price Score:
- Within 30% price range (0.7x to 1.3x) = 30 points
- Outside range = 0 points

Tag Score:
- 5 points per matching tag
- Maximum 30 points (6 matching tags)

Minimum Threshold: 20 points
```

**Ví dụ:**
```
Product A: Men's Dress Shirt - $300 - Tags: [shirt, men, office, cotton]
Product B: Women's Blouse - $280 - Tags: [shirt, women, office, silk]

Score = 40 (same category) + 30 (price $280 in range $210-$390) + 10 (2 matching tags: shirt, office)
      = 80 points ✅ PASS (> 20)
```

### 2. Personalized Algorithm

**Based on View History (30 days):**
```
Relevance Score = Category Match Score + Tag Match Score

Category Match Score:
- 50 points * number of times user viewed products in this category

Tag Match Score:
- 20 points * number of times user viewed products with this tag
```

**Ví dụ:**
```
User viewed:
- 3 products in "Clothing" category
- 5 products with tag "men"
- 2 products with tag "office"

Product X: Category "Clothing", Tags: [men, shirt, office]

Score = (3 * 50) + (5 * 20) + (2 * 20)
      = 150 + 100 + 40
      = 290 points
```

### 3. Trending Algorithm

**Based on Recent Activity:**
```
Trending Score = (Recent Views * 1) + (Recent Purchases * 10)

Recent Views: Last 7 days
Recent Purchases: Last 30 days (non-canceled orders)
```

**Ví dụ:**
```
Product has:
- 50 views in last 7 days
- 10 purchases in last 30 days

Score = (50 * 1) + (10 * 10)
      = 50 + 100
      = 150 points
```

---

## 🎯 Best Practices

### 1. Performance Optimization

**Backend:**
- ✅ Indexes đã được tạo cho tất cả queries
- ✅ Limit số lượng recommendations (default: 8)
- ✅ Async tracking (không block requests)

**Frontend:**
- ✅ Lazy loading images
- ✅ React.memo cho RecommendationCard
- ✅ Only fetch khi có productId

### 2. User Experience

**Graceful Degradation:**
- Không hiển thị section nếu không có recommendations
- Show loading spinner
- Handle errors gracefully

**Privacy:**
- Guest users: Track bằng sessionId
- Logged users: Track bằng userId
- Session expires sau 30 ngày

### 3. Data Quality

**Important: All tags and descriptions must be in English for consistency**

**Tag Best Practices:**
- Use lowercase
- Use hyphens for multi-word tags (e.g., 'long-sleeve', 'high-performance')
- Be specific: 'cotton-shirt' better than just 'shirt'
- Include:
  - Product type: shirt, pants, laptop, phone
  - Gender/Target: men, women, unisex, kids
  - Style: casual, formal, sporty, elegant
  - Material: cotton, leather, denim, silk
  - Color: black, white, red, blue
  - Features: wireless, waterproof, breathable

**Example Tag Sets:**
```sql
-- Clothing
UPDATE products SET tags = ARRAY['shirt', 'men', 'casual', 'cotton', 'short-sleeve', 'blue'];

-- Electronics
UPDATE products SET tags = ARRAY['laptop', 'gaming', 'high-performance', '15-inch', 'rgb-keyboard'];

-- Shoes
UPDATE products SET tags = ARRAY['shoes', 'sneakers', 'running', 'breathable', 'lightweight'];
```

**Để recommendations tốt hơn:**

1. **Add English tags for products:**
```sql
-- Good tag examples (use lowercase English)
UPDATE products 
SET tags = ARRAY['shirt', 'men', 'office', 'cotton', 'long-sleeve'] 
WHERE id = 1;

UPDATE products 
SET tags = ARRAY['laptop', 'gaming', 'high-performance', 'rgb'] 
WHERE id = 2;

UPDATE products 
SET tags = ARRAY['dress', 'women', 'party', 'elegant', 'silk'] 
WHERE id = 3;
```

2. **Add AI descriptions (English):**
```sql
UPDATE products 
SET ai_description = 'Men''s long-sleeve dress shirt made from premium cotton, perfect for office and formal occasions'
WHERE id = 1;
```

3. **Track views consistently:**
- Auto-track ở ProductDetail page
- Manual track ở search results khi click

---

## 🔄 Future Improvements

### Phase 2 - AI Embeddings

**Nâng cao độ chính xác:**
```javascript
// Using OpenAI/Gemini embeddings
const embedding = await generateEmbedding(product.description);
const similarProducts = await findSimilarByEmbedding(embedding);
```

### Phase 3 - Collaborative Filtering

**"Users who bought X also bought Y":**
```sql
-- Matrix factorization approach
-- Can be implemented later for better accuracy
```

### Phase 4 - A/B Testing

**Test different algorithms:**
- Similar vs Trending vs Personalized
- Measure conversion rates
- Optimize weights

---

## ❓ Troubleshooting

### Issue 1: No Recommendations Shown

**Check:**
1. Database có data không?
   ```sql
   SELECT COUNT(*) FROM products WHERE is_active = true;
   ```

2. Products có tags không?
   ```sql
   SELECT id, name, tags FROM products LIMIT 10;
   ```

3. Backend API hoạt động?
   ```bash
   curl http://localhost:3000/api/recommendations/product/1
   ```

### Issue 2: Tracking Không Hoạt Động

**Check:**
1. Table `product_views` có data?
   ```sql
   SELECT * FROM product_views ORDER BY viewed_at DESC LIMIT 10;
   ```

2. Console có errors?
   - Open DevTools → Console
   - Check Network tab

### Issue 3: Recommendations Không Liên Quan

**Fix:**
1. Cập nhật tags cho products
2. Cập nhật categories đúng
3. Điều chỉnh scoring weights trong `recommendation.repository.js`

---

## 📈 Monitoring

### Key Metrics to Track

1. **Recommendation Coverage**
   ```sql
   -- % products that have recommendations
   SELECT 
       COUNT(DISTINCT product_id) * 100.0 / (SELECT COUNT(*) FROM products)
   FROM product_views;
   ```

2. **Average Recommendations per Product**
   ```sql
   SELECT AVG(rec_count) 
   FROM (
       SELECT COUNT(*) as rec_count
       FROM product_views
       GROUP BY product_id
   ) AS counts;
   ```

3. **Click-Through Rate (CTR)**
   - Track clicks on recommendation cards
   - Measure conversion from recommendation to purchase

---

## 🎉 Summary

✅ **Hoàn thành 100%:**
- Database migration
- Backend APIs (9 endpoints)
- Frontend components
- Integration vào ProductDetail page
- Auto-tracking

✅ **Production Ready:**
- Error handling
- Loading states
- Responsive design
- Performance optimized

✅ **Dễ mở rộng:**
- Modular architecture
- Clear separation of concerns
- Easy to add new recommendation types

---

## 📞 Support

Nếu có vấn đề, check:
1. Console logs (Frontend)
2. Server logs (Backend)
3. Database queries (pgAdmin)
4. Network requests (DevTools)

**Happy Coding! 🚀**
