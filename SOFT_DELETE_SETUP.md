# Hướng Dẫn: Cấu Hình Xóa Mềm (Soft Delete) Product

## 1. Cập Nhật Database trong Docker

### Cách 1: Sử dụng Docker exec
```bash
# Copy file SQL vào container
docker cp database/sql/update-soft-delete.sql <container_name>:/tmp/update-soft-delete.sql

# Chạy SQL trong container
docker exec -it <container_name> psql -U postgres -d store -f /tmp/update-soft-delete.sql
```

### Cách 2: Chạy trực tiếp từ command line
```bash
# Connect vào database và chạy từng lệnh
docker exec -it <container_name> psql -U postgres -d store

# Sau đó paste nội dung file update-soft-delete.sql
```

### Cách 3: Sử dụng psql từ host (nếu đã expose port)
```bash
psql -h localhost -p 5432 -U postgres -d store -f database/sql/update-soft-delete.sql
```

## 2. API Endpoints

### DELETE /admin/products/:id - Xóa mềm product (mặc định)
```javascript
// Soft delete (set is_active = false)
DELETE /admin/products/123
Authorization: Bearer <admin_token>

// Response:
{
  "message": "Product deactivated successfully",
  "data": {
    "deleted_id": 123,
    "deleted_name": "Product Name",
    "deletion_type": "SOFT_DELETE"
  }
}
```

### DELETE /admin/products/:id?hardDelete=true - Xóa cứng product
```javascript
// Hard delete (chỉ khi product không có orders)
DELETE /admin/products/123?hardDelete=true
Authorization: Bearer <admin_token>

// Response - Success:
{
  "message": "Product deleted successfully",
  "data": {
    "deleted_id": 123,
    "deleted_name": "Product Name",
    "deletion_type": "HARD_DELETE"
  }
}

// Response - Error (nếu có orders):
{
  "error": "Cannot delete product: Product has existing orders. Use soft delete instead."
}
```

## 3. Validation Rules

### Soft Delete (is_active = false):
✅ **Cho phép khi:**
- Product tồn tại
- Product đang active (is_active = true)

❌ **Không cho phép khi:**
- Product không tồn tại
- Product đã bị deactivate

### Hard Delete (xóa khỏi database):
✅ **Cho phép khi:**
- Product tồn tại
- Product KHÔNG có orders

❌ **Không cho phép khi:**
- Product không tồn tại
- Product có orders (phải dùng soft delete)

## 4. Database Schema

### Cột is_active:
```sql
ALTER TABLE products 
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX idx_products_is_active ON products(is_active);
```

### Function delete_product:
```sql
-- Tự động chọn soft/hard delete dựa trên flag
SELECT * FROM delete_product(product_id, hard_delete_flag);
```

### Function restore_product:
```sql
-- Khôi phục product đã bị soft delete
SELECT * FROM restore_product(product_id);
```

## 5. Frontend Integration

Frontend đã sẵn sàng:
- ProductTable.jsx: Dropdown menu có nút Delete
- EditProduct.jsx: Button Delete Product
- API call: `axios.delete(\`/admin/products/${id}\`)`

## 6. Testing

### Test Soft Delete:
```sql
-- Xóa mềm product
SELECT * FROM delete_product(136, false);

-- Kiểm tra
SELECT id, name, is_active FROM products WHERE id = 136;
-- Kết quả: is_active = false

-- Khôi phục
SELECT * FROM restore_product(136);

-- Kiểm tra lại
SELECT id, name, is_active FROM products WHERE id = 136;
-- Kết quả: is_active = true
```

### Test Hard Delete:
```sql
-- Tạo product test không có orders
INSERT INTO products (name, description, price, stock, category_id)
VALUES ('Test Product', 'For testing', 10.00, 100, 1)
RETURNING id;

-- Hard delete
SELECT * FROM delete_product(<new_id>, true);

-- Kiểm tra (không còn trong DB)
SELECT * FROM products WHERE id = <new_id>;
```

## 7. Error Messages

| Error | Nguyên nhân | Giải pháp |
|-------|------------|-----------|
| `Product not found` | ID không tồn tại | Kiểm tra lại product ID |
| `Product is already deactivated` | Product đã bị soft delete | Dùng restore_product() |
| `Cannot delete product: exists in orders` | Product có orders | Chỉ dùng soft delete |
| `Invalid product ID` | ID không hợp lệ | Truyền số nguyên dương |

## 8. Audit Trail (Optional)

Hiện tại đã log trong service:
```javascript
console.log(`Product ${productId} soft deleted by admin ${adminId}`);
```

Nếu muốn lưu vào database, tạo bảng audit:
```sql
CREATE TABLE product_audit (
    id SERIAL PRIMARY KEY,
    product_id INTEGER,
    action VARCHAR(50),
    admin_id INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);
```
