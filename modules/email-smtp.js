import joyful from '@momsfriendlydevco/joyful';
import nodemailer from 'nodemailer';
import SendEmail from '#modules/email';

/**
* Email module that uses SMTP to send an email
*/
export default class SendEmailSmtp extends SendEmail {
	name = 'Email-Mailgun';

	validate(options) {
		super.validate(options);

		return joyful(options, joi => joi.object({
			host: joi.string().required(),
			port: joi.number().min(20).max(32000).default(587).optional(),
			secure: joi.boolean().default(true).optional(),
			user: joi.string().required(),
			pass: joi.string().required(),
		})
			.unknown(true) // Allow downstream keys for mail email module
		);
	}

	send(message, options) {
		return super.send(message, {
			...options,
			transport: nodemailer.createTransport({
				host: options.host,
				port: options.port ?? 587,
				secure: options.secure ?? false,
				auth: {
					user: options.user,
					pass: options.pass,
				},
			}),
		});
	}
}
