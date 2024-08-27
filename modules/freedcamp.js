import axios from 'axios';
import joyful from '@momsfriendlydevco/joyful';
import SendModule from '#lib/module';

export default class SendSlack extends SendModule {
	name = 'Freedcamp';

	validate(options) {
		return joyful(options, joi => joi.object({
			apiKey: joi.string().required(),
			secret: joi.string().required(),
			projectId: joi.number().required(),
			discussionListTitle: joi.string(),
			discussionListId: joi.number(),
		}).or('discussionListTitle', 'discussionListId'));
	}

	send(message, options) {
		// Calculate FC parameter slush {{{
		let timestamp = new Date().valueOf();
		let params = { // Params to send with each request
			api_key: options.apiKey,
			timestamp,
			hash: crypto.createHmac('sha1', options.secret).update(options.apiKey + timestamp).digest('hex'),
		};
		// }}}

		return Promise.resolve()
			.then(()=>
				options.discussionListId
				|| axios({ // Resolve discussionListId (if we don't already have it)
					method: 'GET',
					url: 'https://freedcamp.com/api/v1/lists/3', // 3 is the discussions list "app"
					params: {
						...params,
						project_id: options.projectId,
					},
				})
				.then(({data}) => {
					if (!data?.data?.lists || !data?.data?.lists?.length) throw new Error('No lists found for that FreedCamp project');
					var dl = data.data.lists.find(list => list.title == options.discussionListTitle);
					if (!dl) throw new Error(`Cannot find matching list "${options.discussionListTitle}" to post to`);
					return dl;
				})
			)
			.then(discussionListId => {
				throw new Error(`FIXME: Post to DL-ID ${discussionListId}`);
			})
	}
}
