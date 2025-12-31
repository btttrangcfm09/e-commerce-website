const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const db = require('../config/database');
const EmailService = require('./email.service');
const UserRepository = require('../repositories/user.repository');
const PasswordChangeRepository = require('../repositories/password-change.repository');

const CODE_MINUTES = 10;

const generateSixDigitCode = () => {
    const n = crypto.randomInt(0, 1000000);
    return String(n).padStart(6, '0');
};

const getCodeSecret = () => {
    return process.env.PASSWORD_CODE_SECRET || process.env.JWT_SECRET || 'dev-secret';
};

const hashCode = (userId, code) => {
    const secret = getCodeSecret();
    return crypto
        .createHash('sha256')
        .update(`${userId}:${code}:${secret}`)
        .digest('hex');
};

class PasswordChangeService {
    static async requestCode(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            throw err;
        }
        if (!user.email) {
            const err = new Error('User email is missing');
            err.status = 400;
            throw err;
        }

        const code = generateSixDigitCode();
        const codeHash = hashCode(userId, code);
        const expiresAt = new Date(Date.now() + CODE_MINUTES * 60 * 1000).toISOString();

        await PasswordChangeRepository.invalidateActiveCodes(userId);
        await PasswordChangeRepository.insertCode({
            id: uuidv4().replace(/-/g, '').slice(0, 32),
            userId,
            codeHash,
            expiresAt,
        });

        if (!EmailService.isConfigured()) {
            if (process.env.NODE_ENV !== 'production') {
                return { sent: false, devCode: code, expiresInMinutes: CODE_MINUTES };
            }
            const err = new Error('Email service is not configured');
            err.status = 500;
            throw err;
        }

        await EmailService.sendPasswordChangeCode({
            to: user.email,
            code,
            minutes: CODE_MINUTES,
        });

        return { sent: true, expiresInMinutes: CODE_MINUTES };
    }

    static async confirmChange(userId, code, newPassword) {
        if (!code || typeof code !== 'string') {
            const err = new Error('Verification code is required');
            err.status = 400;
            throw err;
        }
        if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
            const err = new Error('New password must be at least 6 characters');
            err.status = 400;
            throw err;
        }

        await PasswordChangeRepository.ensureSchema();

        const codeHash = hashCode(userId, code.trim());

        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query(
                `
                SELECT id
                FROM public.password_change_codes
                WHERE user_id = $1
                  AND code_hash = $2
                  AND consumed_at IS NULL
                  AND expires_at > NOW()
                ORDER BY created_at DESC
                LIMIT 1
                FOR UPDATE
                `,
                [userId, codeHash]
            );

            const match = rows[0];
            if (!match) {
                const err = new Error('Invalid or expired verification code');
                err.status = 400;
                throw err;
            }

            // Hash password bằng bcrypt thay vì MD5 để tương thích với login
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            
            await client.query(
                `
                UPDATE public.users
                SET password = $2
                WHERE id = $1
                `,
                [userId, hashedPassword]
            );

            await client.query(
                `
                UPDATE public.password_change_codes
                SET consumed_at = NOW()
                WHERE id = $1
                `,
                [match.id]
            );

            await client.query('COMMIT');
            return { ok: true };
        } catch (e) {
            try {
                await client.query('ROLLBACK');
            } catch (_) {
                // ignore rollback errors
            }
            throw e;
        } finally {
            client.release();
        }
    }
}

module.exports = PasswordChangeService;
