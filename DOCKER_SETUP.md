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

**Windows:**
```powershell
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\store-create.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\CRUD_Users.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\Products.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\Cart.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\Categories.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\Inventory.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\store-orders.sql
docker exec -i ecommerce-db psql -U postgres -d ecommerce -f - < database\sql\store-payments.sql
```

**Linux/Mac:**
```bash
for file in database/sql/*.sql; do
  docker exec -i ecommerce-db psql -U postgres -d ecommerce < "$file"
done
```

Tạo tài khoản admin:
```bash
docker exec -it ecommerce-db psql -U postgres -d ecommerce -c "INSERT INTO users (id, username, password, email, first_name, last_name, role, is_active) VALUES (md5(random()::text || clock_timestamp()::text)::uuid, 'admin', md5('admin123'), 'admin@ecommerce.com', 'Admin', 'User', 'ADMIN', true);"
```

---

## Bước 4: Import dữ liệu mẫu (optional)

```bash
cd database
pip install -r requirements.txt
python gen.py
python ProductImporter.py
cd ..
```

---

## Bước 5: Truy cập

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Tài khoản:**
- Admin: `admin` / `admin123`
- Customer: Xem username trong database (password: `admin`)
  ```bash
  docker exec -it ecommerce-db psql -U postgres -d ecommerce -c "SELECT username FROM users WHERE role='CUSTOMER' LIMIT 10;"
  ```

---

## Lệnh thường dùng

```bash
# Xem logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## Troubleshooting

**SSL error:**
```javascript
// backend/src/config/database.js
ssl: false
```
```bash
docker-compose up -d --build backend
```

**Admin chưa tồn tại:**
```bash
docker exec -it ecommerce-db psql -U postgres -d ecommerce -c "INSERT INTO users (id, username, password, email, first_name, last_name, role, is_active) VALUES (md5(random()::text || clock_timestamp()::text)::uuid, 'admin', md5('admin123'), 'admin@ecommerce.com', 'Admin', 'User', 'ADMIN', true);"
```

**Không có data:**
```bash
cd database
python gen.py
python ProductImporter.py
```
