/**
 *	Fill Select FIeld
 *
 *	@version 1.0.2
 *	@author Mitchell Petty <https://github.com/mpetty/ok-fillSelectField>
 *	@todo add option for changing the text on first option in select fields. defaults to 'select one'
 */
(function($) {
"use strict";

	$.fillSelectField = {

		/**
		 * 	Initialize
		 *
		 *	@param {object} selector
		 *	@param {object} options
		 *	@return {object} selector
		 */
		init : function(selector, options) {
			var self = this,
				method = (typeof options.method === 'string') ? options.method : false,
				callback = (typeof options.callback === 'function') ? options.callback : false,
				ajaxMethod = false;

			if(typeof this.ajaxMethods[method] !== 'undefined') {
				ajaxMethod = this.ajaxMethods[options.method];

				if(ajaxMethod.results) {
					this.getResults(ajaxMethod.results, selector, callback);
				} else {
					$(document).on('fillfield_ajaxComplete.fillfield_'+ajaxMethod.id+'.fillfield', function() {
						ajaxMethod = self.ajaxMethods[options.method];
						self.getResults(ajaxMethod.results, selector, callback);
						$(document).off('fillfield_ajaxComplete.fillfield_'+ajaxMethod.id+'.fillfield');
					});
				}
			} else if(typeof this.methods[method] !== 'undefined') {
				this.getResults(this.methods[method].results, selector, callback);
			}

			return selector;
		},

		/**
		 *	Get results and update html
		 *
		 *	@param {array} results
		 *	@param {object} selector
		 *	@param {function} callback
		 */
		getResults : function(results, selector, callback) {
			var html = [],
				newResults = [];

			if(results) {
				html.push('<option value="">Select One</option>');

				for(var key in results) {
					for(var key2 in results[key]) {
						newResults.push({
							value : key2,
							name : results[key][key2]
						});
					}
				}

				for(var key in newResults) {
					html.push('<option value="'+newResults[key].value+'">'+newResults[key].name+'</option>');
				}

				html = html.join('');

				if(html.length) {
					for(var key in results) {
						$($(selector)[key]).empty().append(html);
					}
				}

				if(typeof callback === 'function') callback.call(this);
			}
		},

		/**
		 * 	Add new method
		 *
		 *	@param {string} name method name
		 *	@param {mixed} method method or object. if object is supplied, method is assumed to be ajax.
		 *	@param {function} ajaxCallback
		 */
		addMethod : function(name, method, ajaxCallback) {
			var self = this,
				defoptions = {global:false};

			if(typeof method === 'function') {
				this.methods[name] = {name:name, method:method, results: method()};

			} else if(typeof method === 'object') {
				this.ajaxEvCount++;

				this.ajaxMethods[name] = {
					name: name,
					id: this.ajaxEvCount,
					method: ajaxCallback,
					ajaxComplete: false,
					results: null,
					args: null
				};

				defoptions.success  = function(data) {
					self.ajaxEvComplete++;
					self.ajaxMethods[name].args = data;
					self.ajaxMethods[name].ajaxComplete = true;
					self.ajaxMethods[name].results = ajaxCallback(data);
					$(document).trigger('fillfield_ajaxComplete.fillfield_'+self.ajaxMethods[name].id+'.fillfield');
					$(document).trigger('fillfield_ajaxSuccess');
				};

				$.ajax($.extend({}, defoptions, method));
			}

		},

		/**
		 * 	Methods
		 */
		methods : {},

		/**
		 * 	Ajax methods
		 */
		ajaxMethods : {},
		ajaxEvCount : 0,
		ajaxEvComplete : 0

	};

	/**
	 * 	fillSelectField jquery plugin
	 *
	 *	@param {object} options
	 */
	$.fn.fillSelectField = function(options) {
		return this.each(function() {
			return $.fillSelectField.init(this, options);
		});
	};

// EOF
})(jQuery);