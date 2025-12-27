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

### 3️. Chạy Migration (1 phút)
```bash
# Khởi động Docker
docker-compose up -d

# Chạy migration
```
cd database
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\005-ai-features.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\add-electronics-tags.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\simple-add-tags.sql
```

### 4️. Khởi Động Servers (2 phút)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

### 5️. Test (30 giây)
```
1. Mở: http://localhost:3000
2. Click nút chat (góc dưới phải) 🌟💬
3. Nhập: "Tìm áo sơ mi nam"
4. Xem kết quả!
```

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
