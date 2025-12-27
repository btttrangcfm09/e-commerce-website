# Docker Setup - Quick Start Guide

## Yêu cầu
- Docker Desktop
- Python 3.x
- Port 3000, 5000, 5432 trống

---

## Bước 1: Clone và tạo file .env

```bash
git clone <repository-url>
cd E-commerce-web
```

Tạo file `.env` ở root:
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
VITE_API_URL=http://localhost:5000
```

Tạo file `database/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## Bước 2: Khởi động Docker

```bash
docker-compose up -d --build
```

---

## Bước 3: Khởi tạo Database

### 3.1. Tạo Schema
Chạy script tạo bảng:
```powershell
# Windows
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\store-create.sql
```

```bash
# Linux/Mac
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/sql/store-create.sql
```

### 3.2. Seed Data
Import dữ liệu mẫu với 120+ products, 35+ categories, 22 users, 50 orders:

```powershell
# Windows
cd database\seed
.\seed-complete.bat
```

```bash
# Linux/Mac
cd database/seed
chmod +x seed-complete.sh
./seed-complete.sh
```

---

## Bước 4: Truy cập

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Test Accounts

**Admin:**
- User: `admin001`
- Password: `admin123`

**Customers:**
- User: `sarah_wilson` / Password: `password123`
- User: `mike_johnson` / Password: `password123`
- User: `emma_davis` / Password: `password123`

### Database Summary
- **Products**: 120+ products across 35+ categories
- **Categories**: Electronics, Clothing, Home & Living, Books & Media, Sports & Outdoors
- **Users**: 2 admins + 20 customers  
- **Orders**: 50 sample orders with items and payments
- **Images**: 3 high-quality images per product (Unsplash)

---

## Bước 5: Verify Setup

```powershell
# Check database
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM products;"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM users;"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM categories;"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM orders;"
```

Expected output:
- Products: 120+
- Users: 22
- Categories: 35+
- Orders: 50

---

## Lệnh thường dùng

```bash
# Xem logs
docker-compose logs -f

# Xem logs backend
docker-compose logs -f backend

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Restart database
docker-compose restart postgres

# Connect to database
docker exec -it ecommerce-db psql -U postgres -d ecommerce
```

### Reseed Database
```powershell
# Clear và seed lại toàn bộ
cd database\seed

# Windows
.\seed-complete.bat

# Linux/Mac  
./seed-complete.sh
```

---

## Troubleshooting

### 1. Port Already in Use
```bash
# Check port usage
netstat -ano | findstr :5432
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### 2. Database Connection Error
```bash
# Check container status
docker ps

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### 3. Backend SSL Error
Edit `backend/src/config/database.js`:
```javascript
ssl: false
```
Then rebuild:
```bash
docker-compose up -d --build backend
```

### 4. Images Not Loading
```powershell
# Apply image fixes
cd database\seed
docker cp 06-fix-images-final.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/06-fix-images-final.sql
```

### 5. Login Failed - Invalid Credentials
Passwords are bcrypt hashed. Use correct passwords:
- Admin: `admin123`
- Customers: `password123`

If still failing, reseed users:
```powershell
cd database\seed
.\seed-simple.bat 2
```

### 6. Cart Not Working
Check if products have `is_active = true`:
```bash
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "UPDATE products SET is_active = true WHERE is_active IS NULL;"
```

### 7. No Products Showing
```powershell
# Reseed all data
cd database\seed
.\clear-and-reseed.bat
```

---

## Additional Resources

- **Seed Documentation**: `database/seed/README-SEED.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Migration Guide**: `database/migrations/README.md`

---

## Complete Reset

To completely reset everything:
```bash
# Stop and remove containers, volumes
docker-compose down -v

# Start fresh
docker-compose up -d --build

# Reseed database
cd database\seed
.\clear-and-reseed.bat
```


# Quick Setup - AI Shopping Assistant

## Các Bước Setup Nhanh (5 phút)

### 1️. Lấy API Key (1 phút)
```
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập Google
3. Click "Create API Key"
4. Copy key
```

### 2️. Cập Nhật .env (30 giây)
```bash
# File: d:\e-commerce-website\.env
GEMINI_API_KEY=paste-your-key-here
```

### 3️⃣ Chạy Migration (1 phút)
```bash
# Khởi động Docker
docker-compose up -d

# Chạy migration
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\005-ai-features.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\add-electronics-tags.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\simple-add-tags.sql
```

### 4️⃣ Khởi Động Servers (2 phút)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

### 5️⃣ Test (30 giây)
```
1. Mở: http://localhost:3000
2. Click nút chat (góc dưới phải) 🌟💬
3. Nhập: "Tìm áo sơ mi nam"
4. Xem kết quả!
```

---

# Google OAuth Login Setup

## 🎯 Tổng quan
Tính năng đăng nhập bằng Google cho phép users:
- ✅ Đăng nhập nhanh bằng tài khoản Google
- ✅ Tự động tạo tài khoản mới nếu chưa có
- ✅ Liên kết tài khoản: user có thể login bằng cả password và Google
- ✅ Bảo mật: không cần tạo password giả

## 📋 Yêu cầu
- Google Account
- Docker đang chạy
- Backend dependencies đã cài (passport, passport-google-oauth20, express-session)

---

## Các Bước Setup (10 phút)

### 1️⃣ Lấy Google OAuth Credentials (5 phút)

#### Bước 1.1: Truy cập Google Cloud Console
```
1. Vào: https://console.cloud.google.com/
2. Đăng nhập Google
3. Tạo project mới hoặc chọn project có sẵn
```

#### Bước 1.2: Enable Google+ API (nếu cần)
```
1. Vào "APIs & Services" > "Library"
2. Tìm "Google+ API" 
3. Click "Enable"
```

#### Bước 1.3: Cấu hình OAuth Consent Screen
```
1. Vào "APIs & Services" > "OAuth consent screen"
2. Chọn "External" (cho testing)
3. Điền:
   - App name: E-Commerce Website
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
4. Click "Save and Continue"
5. Scopes: Thêm email, profile, openid
6. Test users: Thêm email test của bạn
7. Click "Save and Continue"
```

#### Bước 1.4: Tạo OAuth Client ID
```
1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Chọn "Web application"
4. Điền:
   - Name: E-Commerce Google Login
   - Authorized JavaScript origins: 
     http://localhost:5173
   - Authorized redirect URIs:
     http://localhost:5000/client/auth/google/callback
5. Click "Create"
6. Lưu lại Client ID và Client Secret
```

### 2️⃣ Cập nhật Backend .env (1 phút)

Mở file `backend/.env` và thêm/cập nhật:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/client/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-random-secret-key-change-in-production
```

💡 **Tạo SESSION_SECRET ngẫu nhiên:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3️⃣ Chạy Database Migration (1 phút)

Chạy migration để cập nhật database schema hỗ trợ Google OAuth:

```powershell
# Windows
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\007-google-oauth-proper-schema.sql
```

```bash
# Linux/Mac
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/sql/007-google-oauth-proper-schema.sql
```

**Kết quả mong đợi:**
```
ALTER TABLE
DO
DO
COMMENT
COMMENT
COMMENT
UPDATE 21
CREATE FUNCTION
CREATE FUNCTION
NOTICE: Migration completed successfully!
NOTICE: Users can now login with password, Google OAuth, or both
```

**Migration này sẽ:**
- ✅ Cho phép password NULL (cho OAuth users)
- ✅ Thêm cột `google_id` (lưu Google OAuth ID)
- ✅ Thêm cột `provider` ('local', 'google', hoặc 'local,google')
- ✅ Tạo helper functions để check login methods

### 4️⃣ Khởi động lại Backend (1 phút)

```bash
# Dừng backend nếu đang chạy (Ctrl+C)

# Khởi động lại
cd backend
npm run dev
```

Kiểm tra xem backend đã chạy:
```
Server listening on Port 5000
```

### 5️⃣ Test Google Login (1 phút)

1. Mở trình duyệt: http://localhost:5173/login
2. Click nút **"Continue with Google"**
3. Chọn tài khoản Google (phải là test user đã thêm)
4. Cho phép quyền truy cập
5. ✅ Đăng nhập thành công, redirect về trang chủ

---

## 🔍 Kiểm tra Database

Sau khi đăng nhập Google, kiểm tra user mới được tạo:

```powershell
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT id, email, username, google_id, provider FROM users WHERE google_id IS NOT NULL;"
```

Kết quả mong đợi:
```
          id          |        email         |      username      |      google_id       | provider 
----------------------+---------------------+--------------------+--------------------+----------
 8c21725adb0841d5... | user@gmail.com       | user_abc12         | 105220678537...    | google
```

---

## 🎯 Các Tình huống Login

### Tình huống 1: Email mới (chưa có trong hệ thống)
```
User click "Continue with Google"
→ Google xác thực
→ Hệ thống tạo user mới với:
   - email: từ Google
   - google_id: từ Google  
   - provider: 'google'
   - password: NULL
→ User login thành công
```

### Tình huống 2: Email đã tồn tại (đăng ký bằng password trước đó)
```
User click "Continue with Google"
→ Google xác thực
→ Hệ thống liên kết tài khoản:
   - Cập nhật google_id
   - provider: 'local,google'
→ User có thể login bằng cả password VÀ Google
```

### Tình huống 3: Google user thử login bằng password
```
User nhập username/password
→ Hệ thống kiểm tra password = NULL
→ Hiển thị lỗi: "This account does not support password login. 
   Please use Google Sign-In."
```

---

## ⚙️ Database Schema

Bảng `users` sau khi migrate:

```sql
users
├── id              VARCHAR (UUID)
├── username        VARCHAR
├── email           VARCHAR UNIQUE
├── password        VARCHAR NULL          ← Có thể NULL cho OAuth users
├── google_id       VARCHAR UNIQUE NULL   ← Google OAuth ID
├── provider        VARCHAR DEFAULT 'local' ← 'local', 'google', hoặc 'local,google'
├── first_name      VARCHAR
├── last_name       VARCHAR
├── image           VARCHAR
├── role            VARCHAR DEFAULT 'CUSTOMER'
└── created_at      TIMESTAMP
```

---

## 🐛 Troubleshooting

### Lỗi: "redirect_uri_mismatch"
**Nguyên nhân**: Redirect URI trong Google Console không khớp

**Giải pháp**:
```
1. Vào Google Console > Credentials
2. Kiểm tra Authorized redirect URIs:
   http://localhost:5000/client/auth/google/callback
   (PHẢI KHỚP CHÍNH XÁC, không có khoảng trắng, không có trailing slash)
3. Kiểm tra backend/.env:
   GOOGLE_CALLBACK_URL=http://localhost:5000/client/auth/google/callback
```

### Lỗi: "This app hasn't been verified"
**Giải pháp**: Trong development, click "Advanced" > "Go to [App Name] (unsafe)"

### Lỗi: "ERR_CONNECTION_REFUSED"
**Nguyên nhân**: Backend không chạy hoặc sai port

**Giải pháp**:
```bash
# Kiểm tra backend có chạy không
netstat -ano | findstr :5000

# Kiểm tra frontend/.env
VITE_BACKEND_URL=http://localhost:5000

# Restart backend
cd backend
npm run dev
```

### Lỗi: Database "null value in column password"
**Nguyên nhân**: Chưa chạy migration Google OAuth

**Giải pháp**:
```bash
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\007-google-oauth-proper-schema.sql
```

### Lỗi: "Page not found" sau khi Google redirect
**Nguyên nhân**: Route `/auth/google/callback` không được thêm

**Giải pháp**: File đã được fix trong `frontend/src/routes/clientRoutes.js`

---

## 📚 Files Liên quan

### Backend
```
backend/src/
├── config/passport.js                    ← Passport Google Strategy
├── models/User.js                        ← findOrCreateGoogleUser(), canLoginWithPassword()
├── services/user.service.js              ← Check password NULL
├── routes/client/google-auth.routes.js   ← /auth/google routes
└── app.js                                ← Passport middleware init
```

### Frontend
```
frontend/src/
├── context/AuthContext.js                ← loginWithGoogle(), handleGoogleCallback()
├── components/common/GoogleLoginButton.jsx ← Google login button
├── pages/auth/GoogleCallback.jsx         ← Handle redirect from Google
├── pages/client/Login/LoginForm.jsx      ← Login page với Google button
└── routes/clientRoutes.js                ← Route cho /auth/google/callback
```

### Database
```
database/sql/
└── 007-google-oauth-proper-schema.sql    ← Complete OAuth schema migration
```

### Documentation
```
SETUP.md                                  ← Complete setup guide (THIS FILE)
```

---

## ✅ Checklist Hoàn thành

- [ ] Tạo OAuth credentials trên Google Cloud Console
- [ ] Cập nhật GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào backend/.env
- [ ] Chạy migration 007-google-oauth-proper-schema.sql
- [ ] Restart backend server
- [ ] Test login Google thành công
- [ ] Kiểm tra user mới trong database

---

## 🚀 Production Deployment

Khi deploy lên production:

1. **Cập nhật Google Console**:
   ```
   Authorized JavaScript origins: https://your-domain.com
   Authorized redirect URIs: https://your-api-domain.com/client/auth/google/callback
   ```

2. **Cập nhật .env**:
   ```env
   GOOGLE_CALLBACK_URL=https://your-api-domain.com/client/auth/google/callback
   FRONTEND_URL=https://your-domain.com
   NODE_ENV=production
   ```

3. **Publish OAuth Consent Screen**: Chuyển từ "Testing" sang "Published"

4. **Use HTTPS**: Bắt buộc trong production

---


---

##  Checklist

- [ ] API Key đã lấy và cập nhật vào .env
- [ ] Docker đang chạy
- [ ] Migration đã chạy thành công
- [ ] Backend chạy ở port 5000
- [ ] Frontend chạy ở port 3000
- [ ] Test chat hoạt động

---

##  Nếu Gặp Lỗi

### Backend không start
```bash
cd backend
npm install @google/generative-ai
npm run dev
```

### Migration fail
```bash
# Check Docker
docker-compose ps

# Restart database
docker-compose restart postgres
```

### Chat không hoạt động
```
1. Check backend logs
2. Test API: http://localhost:5000/client/ai-chat/health
3. Check browser console (F12)
```

---

## Files Đã Tạo

### Backend (9 files)
```
backend/src/
├── services/ai/
│   ├── gemini.service.js
│   ├── product-matcher.service.js
│   └── ai-chat.service.js
├── controllers/client/
│   └── ai-chat.controller.js
├── routes/client/
│   └── ai-chat.routes.js
├── middleware/auth/
│   └── optional-auth.middleware.js
└── routes/index.js (updated)
```

### Frontend (6 files)
```
frontend/src/
├── components/features/ai-chat/
│   ├── AIChatButton.jsx
│   ├── AIChatWindow.jsx
│   ├── ChatMessage.jsx
│   └── ProductSuggestionCard.jsx
├── services/
│   └── ai-chat.js
├── hooks/
│   └── useAIChat.js
└── App.jsx (updated)
```

### Database (2 files)
```
database/
├── sql/005-ai-features.sql
└── run-ai-migration.bat
```

### Documentation (2 files)
```
AI-SHOPPING-ASSISTANT-README.md
AI-QUICK-SETUP.md (this file)
```

---

# Smart Product Recommendations - Complete Guide

## Database Setup

### Bước 1: Setup Database

```bash
cd database/sql
```

# 1. Chạy migration để tạo bảng recommendations
```
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\006-product-recommendations.sql

```
