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

	static async sendOrderConfirmation({ to, order }) {
		const orderId = order?.id;
		const totalPrice = order?.total_price;
		const shippingAddress = order?.shipping_address;
		const createdAt = order?.created_at;
		const items = Array.isArray(order?.items) ? order.items : [];

		const subject = `Order confirmation${orderId ? ` #${orderId}` : ''}`;

		const safeNumber = (value) => {
			const num = typeof value === 'number' ? value : Number(value);
			return Number.isFinite(num) ? num : null;
		};

		const formatMoney = (value) => {
			const num = safeNumber(value);
			if (num === null) return String(value ?? '');
			return num.toFixed(2);
		};

		const orderIdLine = orderId ? `Order ID: ${orderId}` : null;
		const totalLine = totalPrice !== undefined && totalPrice !== null ? `Total: ${formatMoney(totalPrice)}` : null;
		const shippingLine = shippingAddress ? `Shipping address: ${shippingAddress}` : null;
		

		const textLines = [
			'Order confirmation',
			'Thank you for shopping with us.',
			'',
			orderIdLine,
			totalLine,
			'',
			shippingLine,
			'',
			items.length ? 'Product\tQty\tPrice' : null,
			...items.map((it) => {
				const name = it.product_name || it.product_id;
				return `${name}\t${it.quantity}\t${formatMoney(it.price)}`;
			}),
		].filter((v) => v !== null && v !== undefined);

		const text = textLines.join('\n').replace(/\n{3,}/g, '\n\n');

		const htmlRows = items
			.map((it) => {
				const name = it.product_name || it.product_id;
				return `
					<tr>
						<td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
						<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${it.quantity}</td>
						<td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(it.price)}</td>
					</tr>
				`;
			})
			.join('');

		const html = `
			<div>
				<h2 style="margin: 0 0 8px;">Order confirmation</h2>
				<p style="margin: 0 0 12px;"><strong>Thank you for shopping with us.</strong></p>
				${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ''}
				${totalPrice !== undefined && totalPrice !== null ? `<p><strong>Total:</strong> ${formatMoney(totalPrice)}</p>` : ''}
				${shippingAddress ? `<p><strong>Shipping address:</strong> ${shippingAddress}</p>` : ''}
				${items.length ? `
					<table style="border-collapse: collapse; width: 100%; margin-top: 12px;">
						<thead>
							<tr>
								<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
								<th style="padding: 8px; border: 1px solid #ddd; text-align: center; width: 80px;">Qty</th>
								<th style="padding: 8px; border: 1px solid #ddd; text-align: right; width: 120px;">Price</th>
							</tr>
						</thead>
						<tbody>
							${htmlRows}
						</tbody>
					</table>
				` : ''}
			</div>
		`;

		await EmailService.sendMail({ to, subject, text, html });
	}
}

module.exports = EmailService;

