# 🚀 HƯỚNG DẪN SETUP DATABASE TỪ ĐẦU

## 📋 Chuẩn bị

### Yêu cầu:
- PostgreSQL đã cài đặt (hoặc Docker)
- Docker Desktop đang chạy (nếu dùng Docker)

---

## 🐳 PHƯƠNG PHÁP 1: Sử dụng Docker (Khuyến nghị)

### Bước 1: Khởi động Docker container

Từ thư mục gốc project:

```bash
# Xóa container cũ nếu có
docker-compose down -v

# Khởi động PostgreSQL container
docker-compose up -d
```

### Bước 2: Chờ PostgreSQL khởi động

```bash
# Chờ 5-10 giây để PostgreSQL khởi động hoàn tất
timeout /t 10
```

### Bước 3: Tạo cấu trúc database

```bash
# Chạy file tạo bảng
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/sql/store-create.sql
```

### Bước 4: Seed dữ liệu mẫu

```bash
# Chạy lần lượt các file seed
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/seed/01-categories.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/seed/02-users.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/seed/03-products-part1.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/seed/03-products-part2.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < database/seed/04-orders.sql
```

### Bước 5: Kiểm tra kết quả

```bash
# Kiểm tra số lượng bản ghi
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "
SELECT 
    'users' as table_name, COUNT(*) as total FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
ORDER BY table_name;
"
```

---

## 💻 PHƯƠNG PHÁP 2: Sử dụng PostgreSQL Local

### Bước 1: Tạo database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database mới
CREATE DATABASE ecommerce;

# Thoát
\q
```

### Bước 2: Tạo cấu trúc database

```bash
psql -U postgres -d ecommerce < database/sql/store-create.sql
```

### Bước 3: Seed dữ liệu

```bash
psql -U postgres -d ecommerce < database/seed/01-categories.sql
psql -U postgres -d ecommerce < database/seed/02-users.sql
psql -U postgres -d ecommerce < database/seed/03-products-part1.sql
psql -U postgres -d ecommerce < database/seed/03-products-part2.sql
psql -U postgres -d ecommerce < database/seed/04-orders.sql
```

### Bước 4: Kiểm tra

```bash
psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM users;"
psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM products;"
psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM categories;"
psql -U postgres -d ecommerce -c "SELECT COUNT(*) FROM orders;"
```

---

## 🔧 Script tự động (Windows)

Tạo file `setup-database.bat` trong thư mục `database`:

```batch
@echo off
echo ====================================
echo DATABASE SETUP SCRIPT
echo ====================================
echo.

echo Step 1: Starting Docker containers...
cd ..
docker-compose down -v
docker-compose up -d
cd database

echo.
echo Step 2: Waiting for PostgreSQL to start...
timeout /t 15

echo.
echo Step 3: Creating database structure...
docker exec -i ecommerce-db psql -U postgres -d ecommerce < sql/store-create.sql

echo.
echo Step 4: Seeding data...
docker exec -i ecommerce-db psql -U postgres -d ecommerce < seed/01-categories.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < seed/02-users.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < seed/03-products-part1.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < seed/03-products-part2.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce < seed/04-orders.sql

echo.
echo Step 5: Verification...
docker exec -i ecommerce-db psql -U postgres -d ecommerce -c "SELECT 'users' as table_name, COUNT(*) as total FROM users UNION ALL SELECT 'categories', COUNT(*) FROM categories UNION ALL SELECT 'products', COUNT(*) FROM products UNION ALL SELECT 'orders', COUNT(*) FROM orders ORDER BY table_name;"

echo.
echo ====================================
echo SETUP COMPLETE!
echo ====================================
pause
```

Chạy script:
```bash
cd database
setup-database.bat
```

---

## 📊 CẤU TRÚC DATABASE

### **Bảng chính:**

1. **users** - Người dùng
   - Trường mới: `phone`, `address`, `image`
   - id: **char(255)** (từ varchar(255))

2. **categories** - Danh mục sản phẩm
   - id: **serial** (giữ nguyên)
   - Hỗ trợ danh mục phân cấp

3. **products** - Sản phẩm
   - id: **serial** (giữ nguyên)
   - category_id: integer

4. **orders** - Đơn hàng
   - id: **char(255)** (từ char(16))
   - customer_id: char(255)

5. **order_items** - Chi tiết đơn hàng
   - id: **char(255)** (từ char(24))
   - order_id: char(255)
   - product_id: integer

6. **order_status_history** - Lịch sử trạng thái đơn
   - id: **serial** (giữ nguyên)
   - order_id: char(255)

7. **carts** - Giỏ hàng
   - id: **char(255)** (từ char(16))
   - customer_id: char(255)

8. **cart_items** - Sản phẩm trong giỏ
   - id: **char(255)** (từ char(24))
   - cart_id: char(255)
   - product_id: integer

9. **inventory** - Quản lý kho
   - id: **char(255)** (từ char(8))
   - product_id: integer

10. **payments** - Thanh toán
    - id: **char(255)** (từ char(28))
    - order_id: char(255)

---

## 🔐 THÔNG TIN ĐĂNG NHẬP MẶC ĐỊNH

### Tài khoản Admin:
```
Username: admin
Password: admin123
Email: admin@ecommerce.com
Phone: 0123456789
Address: Ha Noi, Vietnam
```

### Tài khoản khách hàng mẫu:
- Username: `sarah_wilson` / Password: `password123`
- Username: `mike_johnson` / Password: `password123`
- Tất cả 18 khách hàng đều có phone và address

---

## 🔍 QUERY KIỂM TRA

### Xem tất cả users với thông tin đầy đủ:
```sql
SELECT id, username, email, first_name, last_name, phone, address, image, role 
FROM users 
ORDER BY role, created_at;
```

### Kiểm tra products:
```sql
SELECT p.id, p.name, p.price, p.stock, c.name as category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
LIMIT 10;
```

### Xem orders với customer info:
```sql
SELECT 
    o.id, 
    o.order_status,
    o.total_price,
    u.username,
    u.email,
    u.phone,
    o.shipping_address
FROM orders o
JOIN users u ON o.customer_id = u.id
WHERE o.is_active = true
ORDER BY o.created_at DESC;
```

---

## 🛠️ TROUBLESHOOTING

### Lỗi: "database already exists"
```bash
# Xóa database cũ
docker exec -i ecommerce-db psql -U postgres -c "DROP DATABASE IF EXISTS ecommerce;"
docker exec -i ecommerce-db psql -U postgres -c "CREATE DATABASE ecommerce;"
```

### Lỗi: Container không chạy
```bash
# Kiểm tra status
docker ps -a

# Xem logs
docker logs ecommerce-db

# Restart
docker-compose restart
```

### Reset hoàn toàn:
```bash
# Xóa tất cả container và volume
docker-compose down -v

# Xóa các file database trong .data nếu có
rm -rf .data

# Chạy lại từ đầu
docker-compose up -d
```

---

## ✅ CHECKLIST

- [ ] Docker Desktop đang chạy
- [ ] Container PostgreSQL đã khởi động
- [ ] File store-create.sql đã chạy thành công
- [ ] Tất cả file seed đã import
- [ ] Kiểm tra số lượng records trong các bảng
- [ ] Test login với tài khoản admin
- [ ] Kiểm tra các trường mới (phone, address, image) trong bảng users

---

**🎉 Chúc bạn setup thành công!**
