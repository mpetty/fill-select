/**
 *	Fill Select FIeld
 *
 *	@version 1.0.0
 *	@author Mitchell Petty <https://github.com/mpetty/ok-fillSelectField>
 */
(function($) {
"use strict";

	$.fillSelectField = {

		/**
		 * 	Initialize
		 *
		 *	@param {object} selector
		 *	@param {object} options
		 */
		init : function(selector, options) {
			var method = (typeof options.method === 'string') ? options.method : false,
				results = this.getResults(method),
				html = [];

			if(results) {
				html.push('<option value="">Select One</option>');

				for(var key in results) {
					html.push('<option value="'+results[key].value+'">'+results[key].name+'</option>');
				}

				html = html.join('');

				if(html.length) {
					for(var key in results) {
						$($(selector)[key]).empty().append(html);
					}
				}
			}

			return selector;
		},

		/**
		 *	Get results from method
		 *
		 *	@param {string} method
		 */
		getResults : function(method) {
			var results = (!this.methods[method]) ? null : this.methods[method](),
				newResults = [];

			if(results) {
				for(var key in results) {
					for(var key2 in results[key]) {
						newResults.push({
							value : key2,
							name : results[key][key2]
						});
					}
				}
			}

			return newResults;
		},

		/**
		 * 	Add new method
		 *
		 *	@param {string} name
		 *	@param {function} method
		 */
		addMethod : function(name, method) {
			this.methods[name] = method;
		},

		/**
		 * 	Default methods
		 */
		methods : {}

	};

	/**
	 * 	fillSelectField jquery plugin
	 *
	 *	@param {object} options
	 */
	$.fn.fillSelectField = function(options) {
		return this.each(function() {
			return $.fillSelectField.init(this, options);;
		});
	};

// EOF
})(jQuery);