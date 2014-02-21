/**
 *	Add methods for fill form select
 *
 *	@version 1.0.0
 *	@author Mitchell Petty <https://github.com/mpetty/ok-fillSelectField>
 */
(function($) {
"use strict";

	if(! $.fillSelectField) return;

	/**
	 *	States - using ajax
	 */
	$.fillSelectField.addMethod("state", {url: 'http://api.geonames.org/searchJSON', dataType: 'json', data: {country:'US',type:'json', featureCode: 'ADM1', maxRows: 1000, username:'thelearninghouse'}}, function(data) {
		var geonames = (typeof data.geonames === 'object') ? data.geonames : false,
			states = {},
			results = [];

		if(geonames) {
			geonames.sort(function(a, b) {
			    if (a.adminName1 == b.adminName1) {
			        return 0;
			    } else if (a.adminName1 > b.adminName1) {
			        return 1;
			    }

			    return -1;
			});

			for(var key in geonames) {
				(typeof geonames[key] !== 'undefined') ? states[geonames[key].adminCode1] = geonames[key].adminName1 : null;
			}
		}

		results.push(states);
		return results;
	}, true);

	/**
	 *	Countries - using ajax
	 */
	$.fillSelectField.addMethod("country", {url:'http://api.geonames.org/countryInfoJSON', dataType:'json', data: {orderby: 'countryName', maxRows: 1000, username: 'thelearninghouse'}}, function(data) {
		var geonames = (typeof data.geonames === 'object') ? data.geonames : false,
			countries = {},
			results = [];

		if(geonames) {
			geonames.sort(function(a, b) {
			    if (a.countryName == b.countryName) {
			        return 0;
			    } else if (a.countryName > b.countryName) {
			        return 1;
			    }

			    return -1;
			});

			for(var key in geonames) {
				(typeof geonames[key] !== 'undefined') ? countries[geonames[key].countryCode] = geonames[key].countryName : null;
			}
		}

		results.push(countries);

		return results;
	}, true);

	/**
	 *	States
	 */
	$.fillSelectField.addMethod("state_noajax", function() {
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

		results.push(states);
		return results;
	});

// EOF
})(jQuery);