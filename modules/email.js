import joyful from '@momsfriendlydevco/joyful';
import SendModule from '#lib/module';

/**
* Generic email sending module
*
* This module provides a basic module and should be extended by others
*/
export default class SendEmail extends SendModule {
	name = 'Email';

	validate(options) {
		return joyful(options, joi => joi.object({
			to: joi.string().required(),
			from: joi.string().required(),
			subject: joi.string().required(),
			cc: joi.string().optional(),
			bcc: joi.string().optional(),
		})
			.unknown(true) // Allow additional keys from other email-* modules
		);
	}

	async send(message, options) {
		if (!options.transport) throw new Error('Emailer module requires a transport - perhaps you should be using one of the email-* flavours?');

		return await options.transport.sendMail({
			to: options.to,
			from: options.from,
			subject: options.subject,
			cc: options.cc,
			bcc: options.bcc,
			text: await message.as('text'),
			...(message.has('html') && {html: await message.as('html')}),
		});
	}
}
