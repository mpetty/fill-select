/**
 *	Fill Select FIeld
 *
 *	@version 1.0.1
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
			var self = this,
				method = (typeof options.method === 'string') ? options.method : false,
				ajaxMethod = false;

			if(typeof this.ajaxMethods[method] !== 'undefined') {
				ajaxMethod = this.ajaxMethods[options.method];

				if(ajaxMethod.results) {
					this.getResults(ajaxMethod.results, selector);
				} else {
					$(document).on('fillfield_ajaxComplete_'+ajaxMethod.id+'.fillfield', function(){
						ajaxMethod = self.ajaxMethods[options.method];
						self.getResults(ajaxMethod.results, selector, true);
						$(document).off('fillfield_ajaxComplete_'+ajaxMethod.id+'.fillfield');
					});
				}
			} else if(typeof this.methods[method] !== 'undefined') {
				this.getResults(this.methods[method].results, selector);
			}

			return selector;
		},

		/**
		 *	Get results from method
		 *
		 *	@param {string} method
		 *	@param {boolean} ajax
		 *	@todo work on getting ajax method results to work asynchronously. maybe add the content in on complete.
		 */
		getResults : function(results, selector, ajax) {
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
				options = {url:null, dataType:'json'};

			// Regular function
			if(typeof method === 'function') {
				this.methods[name] = {name:name, method:method, results: method()};

			// Else its ajax
			} else if(typeof method === 'object') {
				options = $.extend({}, options, method);

				this.ajaxMethods[name] = {
					name: name,
					id: this.ajaxEvCount,
					method: ajaxCallback,
					ajaxComplete: false,
					results: null,
					args: null,
				};

				this.ajaxEvCount++;

				$.ajax({
					url: options.url,
					dataType: options.dataType,
					data: options.data,
					global: false,
					success: function(data) {
						self.ajaxMethods[name].args = data;
						self.ajaxMethods[name].ajaxComplete = true;
						self.ajaxMethods[name].results = ajaxCallback(data);
						$(document).trigger('fillfield_ajaxComplete_'+self.ajaxMethods[name].id+'.fillfield');
					}
				});
			}

		},

		/**
		 * 	Default methods
		 */
		methods : {},

		/**
		 * 	List of ajax methods
		 */
		ajaxMethods : {},
		ajaxEvCount : 0

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