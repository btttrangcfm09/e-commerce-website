const db = require('../config/database');

class User {

    // Tìm user theo username
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        return result[0];
    }

    // Tìm user theo ID (để xem profile)
    static async findById(id) {
        const query = `
            SELECT id, username, email, first_name, last_name, role, phone, address, image,
                created_at
            FROM users WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return result[0];
    }

    // Tạo user mới (Chỉ INSERT, không logic)
    static async create(userData) {
        const { id, username, password, email, firstName, lastName, role} = userData;
        
        const query = `
            INSERT INTO users (
                id, username, password, email, first_name, last_name, 
                role, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING id, username, email, role
        `;
        
        const values = [
            id, username, password, email, firstName, lastName, 
            role || 'CUSTOMER'
        ];

        // Lưu ý: Mình để is_active = true luôn cho tiện test. 
        // Nếu muốn xác thực email thì để false rồi làm logic gửi mail sau.

        const result = await db.query(query, values);
        return result[0];
    }

    // Cập nhật Profile
    static async updateProfile(userId, data) {
        // Xây dựng câu query động dựa trên dữ liệu gửi lên
        const fields = [];
        const values = [];
        let index = 1;

        if (data.email) { fields.push(`email = $${index++}`); values.push(data.email); }
        if (data.firstName) { fields.push(`first_name = $${index++}`); values.push(data.firstName); }
        if (data.lastName) { fields.push(`last_name = $${index++}`); values.push(data.lastName); }
        // if (data.phone) { fields.push(`phone = $${index++}`); values.push(data.phone); }
        // if (data.address) { fields.push(`address = $${index++}`); values.push(data.address); }
        // if (data.image) { fields.push(`image = $${index++}`); values.push(data.image); }

        if (fields.length === 0) return null;

        values.push(userId);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`;
        
        await db.query(query, values);
        return true;
    }


    // Tìm user theo email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result[0];
    }

    // Đổi mật khẩu
    static async updatePassword(userId, newHashedPassword) {
        const query = 'UPDATE users SET password = $1 WHERE id = $2';
        await db.query(query, [newHashedPassword, userId]);
    }

    // Lấy tất cả user
    static async getAll() {
        const query = `
            SELECT id, username, email, first_name, last_name, role, 
                created_at 
            FROM users
        `;
        return await db.query(query);
    }

    // Tìm user theo Google ID
    static async findByGoogleId(googleId) {
        const query = 'SELECT * FROM users WHERE google_id = $1';
        const result = await db.query(query, [googleId]);
        return result[0];
    }

    // Tìm hoặc tạo user từ Google OAuth (PROPER IMPLEMENTATION)
    static async findOrCreateGoogleUser(googleData) {
        const { googleId, email, firstName, lastName, image } = googleData;
        
        // Tìm user theo Google ID trước
        let user = await this.findByGoogleId(googleId);
        if (user) return user;

        // Nếu không tìm thấy, kiểm tra xem email đã tồn tại chưa
        user = await this.findByEmail(email);
        if (user) {
            // ⭐ ACCOUNT LINKING: User đã tồn tại với email này
            // → Liên kết tài khoản với Google
            const updateQuery = `
                UPDATE users 
                SET google_id = $1, 
                    provider = CASE 
                        WHEN provider = 'local' THEN 'local,google'
                        ELSE provider || ',google'
                    END,
                    image = COALESCE(image, $2)
                WHERE id = $3 
                RETURNING *
            `;
            const result = await db.query(updateQuery, [googleId, image, user.id]);
            return result[0];
        }

        // ⭐ NEW GOOGLE USER: Tạo user mới từ Google
        const { v4: uuidv4 } = require('uuid');
        const newId = uuidv4().replace(/-/g, '');
        
        const insertQuery = `
            INSERT INTO users (
                id, username, email, first_name, last_name, 
                google_id, image, role, provider, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING *
        `;
        
        const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
        const values = [
            newId,
            username,
            email,
            firstName,
            lastName,
            googleId,
            image,
            'CUSTOMER',
            'google'  // ⭐ Provider = google
        ];

        const result = await db.query(insertQuery, values);
        return result[0];
    }

    // ⭐ Check if user can login with password
    static async canLoginWithPassword(userId) {
        const query = 'SELECT password FROM users WHERE id = $1';
        const result = await db.query(query, [userId]);
        return result[0]?.password !== null;
    }

    // ⭐ Check if user can login with Google
    static async canLoginWithGoogle(userId) {
        const query = 'SELECT google_id FROM users WHERE id = $1';
        const result = await db.query(query, [userId]);
        return result[0]?.google_id !== null;
    }

}

module.exports = User;
