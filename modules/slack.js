import joyful from '@momsfriendlydevco/joyful';
import {WebClient} from '@slack/web-api';
import SendModule from '#lib/module';

export default class SendSlack extends SendModule {
	name = 'Slack';

	validate(options) {
		return joyful(options, joi => ({
			token: joi.string().required(),
			channel: joi.string().required().regex(/^#/),
			username: joi.string().required(),
		}));
	}

	async send(message, options) {
		let slackClient = new WebClient(options.token);

		return slackClient.chat.postMessage({
			channel: options.channel,
			username: options.username.replace(/^@/, ''),
			as_user: true,
			text: await message.as('markdown#slack'),
		});
	}
}
