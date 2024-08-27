import {expect} from 'chai';
import send from '#lib/send';

describe('send messages', ()=> {

	it('should dispatch messages in various formats', ()=>
		new send()
			.use('slack', {
				enabled: false,
				// ... Slack config goes below here ... //
				token: 'FIXME',
				channel: 'FIXME',
				username: 'FIXME',
			})
			.use('freedcamp', {
				enabled: false,
				// ... Freedcamp config goes here ... //
				apiKey: 'FIXME',
				secret: 'FIXME',
				projectId: 'FIXME',
				discussionListTitle: 'FIXME',
				discussionListId: 'FIXME',
			})
			.send('Hello World')
	);

});
