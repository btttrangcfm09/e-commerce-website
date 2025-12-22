const nodemailer = require('nodemailer');

const parseBoolean = (value, defaultValue = false) => {
	if (value === undefined || value === null) return defaultValue;
	if (typeof value === 'boolean') return value;
	const normalized = String(value).trim().toLowerCase();
	if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
	if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
	return defaultValue;
};

const getMailConfig = () => {
	const host = process.env.MAIL_HOST;
	const port = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined;
	const secure = parseBoolean(process.env.MAIL_SECURE, port === 465);
	const user = process.env.MAIL_USER;
	const pass = process.env.MAIL_PASS;
	const from = process.env.MAIL_FROM || user;

	return { host, port, secure, user, pass, from };
};

const isMailConfigured = () => {
	if (parseBoolean(process.env.MAIL_DISABLED, false)) return false;
	const { host, user, pass } = getMailConfig();
	return Boolean(host && user && pass);
};

const createTransporter = () => {
	const { host, port, secure, user, pass } = getMailConfig();
	if (!host || !user || !pass) return null;

	return nodemailer.createTransport({
		host,
		port: port || 587,
		secure,
		auth: { user, pass },
	});
};

module.exports = {
	getMailConfig,
	isMailConfigured,
	createTransporter,
};

