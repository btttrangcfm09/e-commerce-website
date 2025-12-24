const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { toPublicUser } = require('../models/user.model');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
class UserService {
// --- ĐĂNG NHẬP (Logic thay thế signin SQL) ---
    static async signIn(username, password) {
        // 1. Tìm user
        const user = await User.findByUsername(username);
        if (!user) {
            throw new Error('Invalid login credentials'); // Không nói rõ lỗi để bảo mật
        }

        // 2. So sánh mật khẩu (Bcrypt compare)
        // Lưu ý: Code cũ dùng MD5, code mới dùng Bcrypt. 
        let isMatch = await bcrypt.compare(password, user.password);
        
        // *Fallback cho các user cũ dùng MD5 (chỉ dùng trong giai đoạn chuyển giao)*
        // Nếu bcrypt check false, thử check MD5 thủ công
        if (!isMatch) {
            const md5Hash = require('crypto').createHash('md5').update(password).digest('hex');
            isMatch = (user.password === md5Hash);
            
            // Nếu match MD5, tự động upgrade sang bcrypt
            if (isMatch) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    await db.query('UPDATE public.users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
                } catch (e) {
                    // Log error nhưng vẫn cho login
                    console.error('Failed to upgrade MD5 password to bcrypt:', e);
                }
            }
        }

        if (!isMatch) {
            throw new Error('Invalid login credentials');
        }

        // 3. Chuẩn bị data trả về (loại bỏ password)
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );


        // Chuẩn hóa profile trả về giống format các API /client/profile
        const publicProfile = toPublicUser(user);
        return { token, filteredProfile: publicProfile };
    }

    static async createAccount(data) {
        const password = data.password;

        // 1. Kiểm tra độ dài (Ví dụ: tối thiểu 6 ký tự)
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // 2. (Tùy chọn) Kiểm tra độ phức tạp bằng Regex
        // Ví dụ: Phải có ít nhất 1 chữ cái và 1 số
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasLetter || !hasNumber) {
            throw new Error('Password must contain at least one letter and one number');
        }
        
        // 1. Kiểm tra Username tồn tại chưa
        const existingUser = await User.findByUsername(data.username);
        if (existingUser) throw new Error('Username already exists');

        // 2. Kiểm tra Email tồn tại chưa
        const existingEmail = await User.findByEmail(data.email);
        if (existingEmail) throw new Error('Email already exists');

        
        // 3. Mã hóa mật khẩu (Bcrypt an toàn hơn MD5 nhiều)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // 4. Tạo ID mới
        const newId = uuidv4().replace(/-/g, ''); // Xóa dấu gạch ngang cho giống format cũ

        // 5. Chuẩn bị dữ liệu để lưu
        const userData = {
            id: newId,
            username: data.username,
            password: hashedPassword,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,

            role: 'CUSTOMER' // Mặc định là Customer
        };

        // 6. Lưu User vào DB
        const createdUser = await User.create(userData);
        

        // 7. TẠO GIỎ HÀNG (Thay thế Trigger create_user_cart cũ)
        // Vì chưa có model Cart, mình viết query trực tiếp tại đây cho gọn
        const cartId = uuidv4().replace(/-/g, '').substring(0, 32); 
        await db.query(
            'INSERT INTO carts (id, customer_id, created_at) VALUES ($1, $2, NOW())',
            [cartId, createdUser.id]
        );

        return createdUser;
    }
    
    static async getUserByIdService(id) {
        const user = await User.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    static async getAllUserService() {
        return await User.getAll();
    }

    static async updateProfile(userId, data) {
        return await User.updateProfile(userId, data);
    }

    // Logic đổi mật khẩu
    static async updatePassword(userId, oldPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        // Check pass cũ
        const queryPass = 'SELECT password FROM users WHERE id = $1';
        const res = await db.query(queryPass, [userId]);
        const currentPassHash = res[0].password;

        const isMatch = await bcrypt.compare(oldPassword, currentPassHash);
        if (!isMatch) throw new Error('Old password is incorrect');

        // Hash pass mới
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updatePassword(userId, newHashedPassword);
    }

}

module.exports = UserService;