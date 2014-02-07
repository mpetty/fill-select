/**
 *	Fill Select FIeld
 *
 *	@version 1.0.0
 *	@author Mitchell Petty <mpetty@learninghouse.com>
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
		 *
		 *	@todo Add more methods
		 */
		methods : {

			/** @todo Finish State method */
			state : function() {
				var results = [],
					states = {
					    "AL": "Alabama",
					    "AK": "Alaska",
					    "AS": "American Samoa",
					    "AZ": "Arizona",
					    "AR": "Arkansas",
					    "CA": "California",
					    "CO": "Colorado",
					    "CT": "Connecticut",
					    "DE": "Delaware",
					    "DC": "District Of Columbia",
					    "FM": "Federated States Of Micronesia",
					    "FL": "Florida",
					    "GA": "Georgia",
					    "GU": "Guam",
					    "HI": "Hawaii",
					    "ID": "Idaho",
					    "IL": "Illinois",
					    "IN": "Indiana",
					    "IA": "Iowa",
					    "KS": "Kansas",
					    "KY": "Kentucky",
					    "LA": "Louisiana",
					    "ME": "Maine",
					    "MH": "Marshall Islands",
					    "MD": "Maryland",
					    "MA": "Massachusetts",
					    "MI": "Michigan",
					    "MN": "Minnesota",
					    "MS": "Mississippi",
					    "MO": "Missouri",
					    "MT": "Montana",
					    "NE": "Nebraska",
					    "NV": "Nevada",
					    "NH": "New Hampshire",
					    "NJ": "New Jersey",
					    "NM": "New Mexico",
					    "NY": "New York",
					    "NC": "North Carolina",
					    "ND": "North Dakota",
					    "MP": "Northern Mariana Islands",
					    "OH": "Ohio",
					    "OK": "Oklahoma",
					    "OR": "Oregon",
					    "PW": "Palau",
					    "PA": "Pennsylvania",
					    "PR": "Puerto Rico",
					    "RI": "Rhode Island",
					    "SC": "South Carolina",
					    "SD": "South Dakota",
					    "TN": "Tennessee",
					    "TX": "Texas",
					    "UT": "Utah",
					    "VT": "Vermont",
					    "VI": "Virgin Islands",
					    "VA": "Virginia",
					    "WA": "Washington",
					    "WV": "West Virginia",
					    "WI": "Wisconsin",
					    "WY": "Wyoming"
					};

				results.push(states); // value : name
				return results;
			}

		}

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