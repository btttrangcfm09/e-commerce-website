const db = require('../config/database');

let schemaReady = false;

class PasswordChangeRepository {
    static async ensureSchema() {
        if (schemaReady) return;

        await db.query(
            `
            CREATE TABLE IF NOT EXISTS public.password_change_codes (
                id VARCHAR(32) PRIMARY KEY,
                user_id VARCHAR(32) NOT NULL,
                code_hash VARCHAR(128) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                consumed_at TIMESTAMP NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
            `
        );

        await db.query(
            `
            CREATE INDEX IF NOT EXISTS idx_password_change_codes_user_active
            ON public.password_change_codes(user_id)
            WHERE consumed_at IS NULL;
            `
        );

        schemaReady = true;
    }

    static async invalidateActiveCodes(userId) {
        await PasswordChangeRepository.ensureSchema();
        await db.query(
            `
            UPDATE public.password_change_codes
            SET consumed_at = NOW()
            WHERE user_id = $1 AND consumed_at IS NULL
            `,
            [userId]
        );
    }

    static async insertCode({ id, userId, codeHash, expiresAt }) {
        await PasswordChangeRepository.ensureSchema();
        await db.query(
            `
            INSERT INTO public.password_change_codes (id, user_id, code_hash, expires_at)
            VALUES ($1, $2, $3, $4)
            `,
            [id, userId, codeHash, expiresAt]
        );
    }
}

module.exports = PasswordChangeRepository;
