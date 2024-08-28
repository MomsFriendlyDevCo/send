import SendModule from '#lib/module';

export default class Send {
	/**
	* Lookup object of loaded modules (via `use()`)
	*
	* @type {Object}
	*
	* @property {SendModule} module The initalized module instance
	* @property {Object} options The module options
	*/
	modules = {
	}

	/**
	* Promises we are waiting on
	* @type {Object<Array<Promise>>}
	*/
	promises = {
		modules: [],
	}


	/**
	* Load + setup a module with options
	* Can be called multiple times to instanciate other modules
	*
	* @param {String|Object} mod The name of the module to load OR the raw object to instanciate
	* @param {Object} [options] Options to use with the module
	*
	* @returns {Send} This chainable module
	*/
	use(mod, options) {
		this.promises.modules.push(Promise.resolve()
			.then(()=>
				typeof mod == 'string' && !/\//.test(mod) ? import(`../modules/${mod}.js`) // Plain string - assume its a Send builtin
				: typeof mod == 'string' ? import(mod) // Other strings - assume its a relative path
				: mod instanceof SendModule ? mod // Already a module from somewhere
				: (()=> { throw new Error('Invalid module, must be an instance of SendModule') })()
			)
			.then(importedMod => this.modules[mod] = {
				options,
				module: typeof importedMod.default == 'function' ? new importedMod.default(importedMod.default, options)
					: importedMod.default,
			})
			.then(()=> this.modules[mod].module.validate(options)) // Validate options against loaded module
		);

		return this;
	}


	/**
	* Dispatch a message(s)
	*
	* @param {String|Object|SendMessage|Array<String|Object|SendMessage>} messages Either a simple string (in which case text only is assumed) OR an object of formats OR an instancated message to send or an array of the same
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	send(messages) {
		return Promise.resolve()
			.then(()=> Promise.all(this.promises.modules)) // Wait for modules to finish loading
			.then(()=> Promise.all(
				(Array.isArray(messages) ? messages : [messages])
				.map(message => // Dispatch messages
					Promise.all(Object.values(this.modules)
						.filter(mod => (mod.options.enabled ?? true))
						.map(mod => Promise.resolve()
							.then(()=> mod.module.validateMessage(message, mod.options))
							.then(()=> mod.module.send(message, mod.options))
						)
					)
				)
			))
	}
}
