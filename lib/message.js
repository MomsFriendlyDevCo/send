export default class SendMessage {
	/**
	* Already computed formats for this message
	* Either by the user specifying them or functions converting from other formats
	* @type {Object}
	*/
	content = {
		html: '',
	}


	/**
	* Lookup functions for format conversion
	* Each key is the source format, a hyphen + higher-than and the destination format
	* Each value is the conversion function
	*
	* @type {Object<Function>}
	*/
	converters = {
		'text->html': v => `<p>${v}</p>`,
		'text->markdown#slack': v => v,
	}


	/**
	* Require that we have a format OR we can obtain a format
	* If the format is unobtainable, this function will throw an error
	*
	* @param {String} format The named format to ensure
	* @returns {Promise} A promise which will resolve if the format can be satisfied
	*/
	requireFormat(format) {
		if (this.content[format]) return Promise.resolve(); // Already have the format pre-cached
		return this.as(format)
			.then(()=> true)
			.catch(()=> { throw new Error(`Format not available "${format}"`) })
	}


	/**
	* Returns a boolean answer if the given format is immediately available
	*
	* @param {String} format The format to query
	* @returns {Boolean} Boolean true if the format is available
	*/
	has(format) {
		return !! this.content[format];
	}


	/**
	* Obtain an output format, converting it if need be
	*
	* @param {String} format The format to return
	* @returns {Promise<String>} The eventual HTML output for the message
	*/
	as(format) {
		if (this.content[format]) return Promise.resolve(this.content[format]); // Already have the format specified

		Object.entries(this.converters)
			.find(([key, converter]) => { // Loop until we find a converter
				let [from, to] = key.split(/->/, 2);
				if (this.content[from]) { // We have a valid source
					this.set(to, this.converters[key](this.content[from]));
					return true; // Exit looping over converters
				}
			})

		// Did we convert formats from above?
		if (this.content[from]) return Promise.resolve(this.content[from]);

		throw new Error(`Cannot provide or convert to message format "${format}"`);
	}


	/**
	* Set a format from a simple string OR merge a object of formats
	* This is the same function used when constructing
	*
	* @param {String|Object} format Either the source format to set OR an object of multiple formats
	* @param {String} [content] If `format` is a string, specify the content for the key
	* @returns {SendMessage} This chainable object
	*/
	set(format, content) {
		if (!format) {
			// Pass
		} else if (typeof format == 'string') {
			this.content[format] = content;
		} else if (typeof format == 'object') {
			Object.assign(this.content, format);
		} else {
			throw new Error(`Unknown format type "${typeof format}"`);
		}

		return this;
	}


	/**
	* A message prototype object where each key is a format
	*
	* @param {Object|String} input The raw input object or plaintext string to initalize with
	*/
	constructor(input) {
		if (typeof input == 'string') {
			this.set('text', input);
		} else if (typeof input == 'object') {
			this.set(input);
		}
	}
}
