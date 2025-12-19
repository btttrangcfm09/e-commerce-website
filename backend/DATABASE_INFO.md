# 🎉 Database Setup Complete!

## ✅ Trạng thái Database

Database đã được tạo dữ liệu thành công với **164 bản ghi** trên **10 bảng**.

## 📊 Chi tiết dữ liệu

| Bảng | Số bản ghi | Mô tả |
|------|------------|-------|
| **users** | 6 | Người dùng (1 admin + 5 khách hàng) |
| **products** | 40 | Sản phẩm |
| **categories** | 30 | Danh mục sản phẩm |
| **carts** | 9 | Giỏ hàng |
| **cart_items** | 3 | Sản phẩm trong giỏ |
| **orders** | 9 | Đơn hàng (PENDING, SHIPPED) |
| **order_items** | 19 | Chi tiết đơn hàng |
| **payments** | 2 | Thanh toán (COMPLETED) |
| **inventory** | 46 | Lịch sử kho (RESTOCK, SALE) |
| **order_status_history** | 0 | Lịch sử trạng thái đơn |

---

## 🔐 THÔNG TIN ĐĂNG NHẬP

### Tài khoản ADMIN
```
👤 Username: admin
🔑 Password: admin123
📧 Email: admin@ecommerce.com
🏢 Role: ADMIN
📍 Address: Ha Noi, Vietnam
📞 Phone: 0123456789
```

### Các tài khoản khách hàng
Bạn có thể xem trong database bằng query:
```sql
SELECT id, username, email, first_name, last_name 
FROM users 
WHERE role = 'CUSTOMER';
```

---

## 🛠️ Scripts hữu ích

### Kiểm tra database
```bash
node check-db.js
```

### Tạo thêm dữ liệu mẫu
```bash
node seed-simple.js
```

### Kiểm tra enum values
```bash
node check-enums.js
```

---

## 📝 Các Enum Values trong Database

### Order Status
- `PENDING` - Đơn hàng đang chờ xử lý
- `SHIPPED` - Đơn hàng đã gửi
- `DELIVERED` - Đơn hàng đã giao
- `CANCELED` - Đơn hàng đã hủy

### Payment Status
- `PENDING` - Chờ thanh toán
- `COMPLETED` - Đã thanh toán
- `FAILED` - Thanh toán thất bại

### Payment Method
- `CREDIT_CARD` - Thẻ tín dụng
- `DEBIT_CARD` - Thẻ ghi nợ
- `PAYPAL` - PayPal

### User Role
- `ADMIN` - Quản trị viên
- `CUSTOMER` - Khách hàng

### Inventory Change Type
- `RESTOCK` - Nhập kho
- `SALE` - Bán hàng
- `RETURN` - Trả hàng
- `ADJUSTMENT` - Điều chỉnh

---

## 🚀 Khởi động ứng dụng

### Backend
```bash
cd backend
npm start
# hoặc
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 📌 Ghi chú

1. **Tài khoản admin** đã được kích hoạt (is_active = true)
2. **Đơn hàng mẫu** bao gồm nhiều trạng thái khác nhau
3. **Inventory** đã được cập nhật tự động khi có đơn hàng
4. **Payments** chỉ được tạo cho một số đơn hàng (50%)
5. Mật khẩu được mã hóa bằng **MD5**

---

## 🔍 Query mẫu để kiểm tra

```sql
-- Xem tất cả đơn hàng với thông tin khách hàng
SELECT 
    o.id, 
    o.order_status,
    o.payment_status,
    o.total_price,
    u.username,
    u.email
FROM orders o
JOIN users u ON o.customer_id = u.id
ORDER BY o.created_at DESC;

-- Xem chi tiết đơn hàng
SELECT 
    oi.order_id,
    p.name as product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) as subtotal
FROM order_items oi
JOIN products p ON oi.product_id = p.id;

-- Xem lịch sử inventory
SELECT 
    i.change_date,
    p.name as product_name,
    i.quantity,
    i.change_type
FROM inventory i
JOIN products p ON i.product_id = p.id
ORDER BY i.change_date DESC;
```

---

**🎊 Chúc bạn test thành công!**
