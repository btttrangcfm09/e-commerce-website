const PasswordChangeService = require('../../services/password-change.service');

class PasswordController {
    static async requestChangeCode(req, res) {
        try {
            const userId = req.user.userId;
            const result = await PasswordChangeService.requestCode(userId);
            res.status(200).json({
                message: result.sent
                    ? 'Verification code sent to your email'
                    : 'Email service not configured; returning dev code',
                ...result,
            });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }

    static async confirmChange(req, res) {
        try {
            const userId = req.user.userId;
            const { code, newPassword } = req.body;
            await PasswordChangeService.confirmChange(userId, code, newPassword);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(error.status || 400).json({ message: error.message });
        }
    }
}

module.exports = PasswordController;
