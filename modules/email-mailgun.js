import joyful from '@momsfriendlydevco/joyful';
import nodemailer from 'nodemailer';
import nodemailerMailgun from 'nodemailer-mailgun-transport';
import SendEmail from '#modules/email';

/**
* Email module that uses Mailgun as the transport
*/
export default class SendEmailMailgun extends SendEmail {
	name = 'Email-Mailgun';

	validate(options) {
		super.validate(options);

		return joyful(options, joi => joi.object({
			apiKey: joi.string().required(),
			domain: joi.string().required(),
		})
			.unknown(true) // Allow downstream keys for mail email module
		);
	}

	send(message, options) {
		return super.send(message, {
			...options,
			transport: nodemailer.createTransport(nodemailerMailgun({
				auth: {
					api_key: options.apiKey,
					domain: options.domain,
				},
			})),
		});
	}
}
