const { createTransporter, getMailConfig, isMailConfigured } = require('../config/mail');

class EmailService {
	static isConfigured() {
		return isMailConfigured();
	}

	static async sendMail({ to, subject, text, html }) {
		const transporter = createTransporter();
		const { from } = getMailConfig();

		if (!transporter) {
			const err = new Error('Email service is not configured');
			err.status = 500;
			throw err;
		}

		await transporter.sendMail({
			from,
			to,
			subject,
			text,
			html,
		});
	}

	static async sendPasswordChangeCode({ to, code, minutes = 10 }) {
		const subject = 'Your password change verification code';
		const text = `Your verification code is: ${code}. It expires in ${minutes} minutes.`;
		const html = `
			<div>
				<p>Your verification code is:</p>
				<p style="font-size: 20px; font-weight: 700; letter-spacing: 2px;">${code}</p>
				<p>This code expires in ${minutes} minutes.</p>
			</div>
		`;

		await EmailService.sendMail({ to, subject, text, html });
	}
}

module.exports = EmailService;

