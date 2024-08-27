/* eslint-disable no-unused-vars */

import joyful from '@momsfriendlydevco/joyful';

export default class SendModule {
	name = 'FIXME';

	/**
	* Validate the incoming options for a module
	*
	* @returns {Promise} An eventual promise when validation has completed
	*/
	validate(options) {
		return joyful(options, joi => ({
			// ... Joi config goes here ... //
		}));
	}


	/**
	* Validate the contents of a message (possibly against options)
	*
	* @returns {Promise} An eventual promise when validation has completed
	*/
	validateMessage(message, options) {
		// return message.requireFormat('html')
		// ... validation goes here ... //
	}


	/**
	* Dispatch a message using the given options
	* Options can be assumed to have already passed valiation
	*
	* @returns {Promise} An eventual promise which returns with any tracking data for the message
	*/
	send(content, options) {
		// ... actually dispatch the message ... //
	}
}
