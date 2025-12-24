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
DB_PASSWORD=postgres123
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
DB_PASSWORD=postgres123
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
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database/migrations/004-add-phone-address-user.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database/migrations/002-fix-cart-id-length.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database/migrations/003-add-user-image-column.sql
```

```bash
# Linux/Mac
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/sql/store-create.sql
```

### 3.2. Seed Data (Recommended)
Import dữ liệu mẫu với 110 products, 31 categories, 20 users:

**Option A: Seed All (Quick)**
```powershell
# Windows
cd database\seed
.\seed-simple.bat
```

```bash
# Linux/Mac
cd database/seed
chmod +x seed.sh
./seed.sh
```

**Option B: Seed Step by Step**
```powershell
# Windows - từng bước
cd database\seed

# Bước 1: Categories (31 categories)
.\seed-simple.bat 1

# Bước 2: Users (20 users)
.\seed-simple.bat 2

# Bước 3: Products Part 1 (60 products)
.\seed-simple.bat 3

# Bước 4: Products Part 2 (50 products)
.\seed-simple.bat 4
```

**Option C: Clear & Reseed**
```powershell
# Xóa toàn bộ data và seed lại
cd database\seed
.\clear-and-reseed.bat
```

### 3.3. Apply Image Fixes (Optional but recommended)
Cải thiện chất lượng ảnh sản phẩm:
```powershell
cd database\seed
docker cp 06-fix-images-final.sql ecommerce-db:/tmp/
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f /tmp/06-fix-images-final.sql
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
- **Products**: 110 products across 31 categories
- **Categories**: Electronics, Clothing, Home & Living, Books & Media, Sports & Outdoors
- **Users**: 2 admins + 18 customers
- **Images**: 3 high-quality images per product (Unsplash)

---

## Bước 5: Verify Setup

```powershell
# Check database
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM products;"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM users;"
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM categories;"
```

Expected output:
- Products: 110
- Users: 20
- Categories: 31 (including 5 main categories)

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
.\clear-and-reseed.bat

# Hoặc chỉ seed products mới
.\seed-simple.bat 3
.\seed-simple.bat 4
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
