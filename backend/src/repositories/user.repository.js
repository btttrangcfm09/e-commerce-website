const db = require('../config/database');

class UserRepository {
    static async findById(userId) {
        const rows = await db.query(
            `
            SELECT
                id,
                username,
                email,
                first_name,
                last_name,
                role,
                created_at,
                image
            FROM public.users
            WHERE id = $1
            LIMIT 1
            `,
            [userId]
        );
        return rows[0] || null;
    }

    static async findByUsername(username) {
        const rows = await db.query(
            `
            SELECT
                id,
                username,
                password,
                email,
                first_name,
                last_name,
                role,
                created_at,
                image
            FROM public.users
            WHERE username = $1
            LIMIT 1
            `,
            [username]
        );
        return rows[0] || null;
    }

    static async isUsernameTaken(username, excludeUserId) {
        const rows = await db.query(
            `
            SELECT 1
            FROM public.users
            WHERE username = $1
              AND id <> $2
            LIMIT 1
            `,
            [username, excludeUserId]
        );
        return rows.length > 0;
    }

    static async updateProfile(userId, updateFields) {
        // updateFields: keys in DB column names (email, first_name, last_name, image, ...)
        const entries = Object.entries(updateFields).filter(([, v]) => v !== undefined);
        if (entries.length === 0) {
            return await UserRepository.findById(userId);
        }

        const setClauses = [];
        const values = [userId];

        for (const [column, value] of entries) {
            values.push(value);
            setClauses.push(`${column} = $${values.length}`);
        }

        const rows = await db.query(
            `
            UPDATE public.users
            SET ${setClauses.join(', ')}
            WHERE id = $1
            RETURNING
                id,
                username,
                email,
                first_name,
                last_name,
                role,
                created_at,
                image
            `,
            values
        );

        return rows[0] || null;
    }

    static async clearProfileImage(userId) {
        const rows = await db.query(
            `
            UPDATE public.users
            SET image = NULL
            WHERE id = $1
            RETURNING
                id,
                username,
                email,
                first_name,
                last_name,
                role,
                created_at,
                image
            `,
            [userId]
        );
        return rows[0] || null;
    }

    static async updatePasswordMd5(userId, newPassword) {
        // Đổi tên method này nhưng giữ tương thích, giờ dùng bcrypt
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const rows = await db.query(
            `
            UPDATE public.users
            SET password = $2
            WHERE id = $1
            RETURNING id
            `,
            [userId, hashedPassword]
        );
        return rows[0] || null;
    }
}

module.exports = UserRepository;
