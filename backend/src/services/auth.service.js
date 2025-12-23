const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Cần đảm bảo đã cài: npm install bcryptjs
const db = require('../config/database');

exports.validateAdminCredentials = async (username, password) => {
    try {
        // 1. Tìm user trong DB bằng raw SQL
        const query = 'SELECT id, username, password, role FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        const user = result[0];

        // 2. Nếu không tìm thấy user
        if (!user) {
            throw new Error('Wrong username or password');
        }

        // 3. So sánh mật khẩu (Bcrypt)
        // Lưu ý: Password trong DB phải là hash bcrypt.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Wrong username or password');
        }

        // 4. Kiểm tra quyền Admin
        if (user.role !== 'ADMIN') {
            const error = new Error('Unauthorized. User is not an admin.');
            error.statusCode = 403;
            throw error;
        }

        // 5. Trả về thông tin (để controller tạo token)
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    } catch (err) {
        throw err;
    }
};

exports.generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};