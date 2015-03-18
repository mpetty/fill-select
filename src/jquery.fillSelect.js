/*!
 *  Fill Select
 *
 *  @version 1.0.5
 *  @author Mitchell Petty <https://github.com/mpetty/fill-select>
 * 	@todo Ajax functionality needs to be cleaned up.
 */
(function($) {
"use strict";

    /**
     * 	Fill Select plugin core
     *
     *  @param {object} selector
     *  @param {object} options
     */
    var FillSelect = function(selector, options) {
    	this.selector = $(selector);
        this.options = $.extend({}, $.fn.fillSelect.defaults, options);
        this.fillSelectGlobal = $.fillSelect;
        this.selector.data('fillSelect', this.options);
        this.method = false;
    	this.create();
    };

    fillSelect.prototype = {

        /**
         *  Create
         */
        create : function() {

            // Set vars
            var self = this;

            // For ajax requests
            if(typeof this.fillSelectGlobal.ajaxMethods[this.options.method] !== 'undefined') {
                this.method = this.fillSelectGlobal.ajaxMethods[this.options.method];

                // Ajax already complete, fill the field
                if(this.method.results) {

                    this.setHTML();
                    this.fillSelectGlobal.trigger('fillfield_renderComplete.fillfield');

                // allow completion of ajax before continuing
                } else {

                    $(this.fillSelectGlobal).on('ajaxComplete.fillSelect-'+this.method.id, function() {
                        self.method = self.fillSelectGlobal.ajaxMethods[self.options.method];
                        self.setHTML();
                        $(this.fillSelectGlobal).off('ajaxComplete.fillSelect-'+self.method.id);
                        if(self.method.active) self.fillSelectGlobal.trigger('renderComplete');
                    });

                }

            // Other methods
            } else if(typeof this.fillSelectGlobal.methods[this.options.method] !== 'undefined') {
           		this.method = this.fillSelectGlobal.methods[this.options.method];
                this.setHTML();
            }

        },

        /**
         *  Get results
         *
         *  @return {object} newresults
         */
        getResults : function() {

        	// Set vars
            var results = this.method.results || false,
            	newresults = [];

            // Quit if no results
            if(typeof results !== 'undefined' && results) {

            	// Loop through results
                for(var results_key in results) {

                	// Build new object
                    newresults.push({
                        value : results_key,
                        name : results[results_key]
                    });
                }
            }

            // Return new results object
            return newresults;
        },

        /**
         *  Set html
         */
        setHTML : function() {

            // Set vars
            var html = [],
                htmlString = '',
                curValue = this.selector.val(),
                newresults = this.getResults();

            // Prevent errors if no results
            if(newresults) {

            	// Push current value into array if not already in one.
            	// This allows support for multi selects since multi select values are returned as an array
            	if(!$.isArray(curValue)) curValue = [curValue];

                // Set default options text if not set to false.
                if(this.options.defaultText) html.push(this.setOptionString('', this.options.defaultText, this.options.optionString));

                // Build the options
                for(var key in newresults) {
                    if( $.inArray(newresults[key].value, curValue) !== -1 ) {
                        html.push(this.setOptionString(newresults[key].value, newresults[key].name, this.options.optionString, {selected: 'selected'}));
                    } else {
                        html.push(this.setOptionString(newresults[key].value, newresults[key].name, this.options.optionString));
                    }
                }

                // Convert options array into string
                html = $(html.join(''));

                // Append the results into the page
                if(html.length) this.selector.empty().append(html);

                // Fire callback if there is one
                if(typeof this.options.callback === 'function') this.options.callback.call(this, this.selector);

            }

        },

        /**
         *  Set option string
         *
         *  @param {string} value
         *  @param {string} name
         *  @param {string|function} optionString
         *  @param {object} attributes
         *  @return {string} htmlString
         */
        setOptionString : function(value, name, optionString, attributes) {

            // Set vars
            var htmlString = '',
                attString = '';

            // Update option string
            if(typeof optionString === 'function') {
                optionString = optionString(value, name);
            } else if(typeof optionString !== 'string') {
                optionString = 'option';
            }

            // Update attributes string
            if(typeof attributes !== 'undefined') {
                for(var key in attributes) {
                    attString += ' '+key+'="'+attributes[key]+'"';
                }
            }

            // Build html
            htmlString += '<';
            htmlString += optionString;
            htmlString += attString;
            htmlString += ' value="'+value+'">';
            htmlString += name;
            htmlString += '</option>';

            // Return the string
            return htmlString;

        }

    };

    /**
     * 	Fill Select global
     */
    $.fillSelect = {

        /**
         *  Add new method
         *
         *  @param {string} name method name
         *  @param {mixed} method method or object. if object is supplied, method is assumed to be ajax.
         *  @param {function} ajaxCallback
         */
        addMethod : function(name, method, ajaxCallback, active) {

            // Set vars
            var self = this,
                isActive = (typeof active !== 'undefined') ? active : true,
                defoptions = {global:false};

            // If the method is a function, Use it to get the results
            if(typeof method === 'function') {
                this.methods[name] = {name:name, method:method, results: method()};

            // If the method is an object, assume its an ajax request method
            } else if(typeof method === 'object') {
                // Set number of ajax methods
                if(isActive) this.ajaxEvCount++;

                // Update ajaxmethods object with properties
                this.ajaxMethods[name] = {
                    active: isActive,
                    name: name,
                    id: this.ajaxEvCount,
                    method: ajaxCallback,
                    ajaxComplete: false,
                    results: null,
                    args: null
                };

                // Ajax success callback
                defoptions.success  = function(data) {
                    if(isActive) self.ajaxEvComplete++;
                    self.ajaxMethods[name].args = data;
                    self.ajaxMethods[name].ajaxComplete = true;
                    self.ajaxMethods[name].results = ajaxCallback(data);
                    $.fillSelect.trigger('ajaxSuccess');
                };

                // Ajax error callback
                defoptions.error  = function(xhr) {
                    $.fillSelect.trigger('ajaxError');
                };

                // Ajax complete callback
                defoptions.complete  = function(xhr) {
                    $.fillSelect.trigger('ajaxComplete.fillSelect-'+self.ajaxMethods[name].id);
                };

                // Fire ajax
                this.ajaxDeferred.push( $.ajax($.extend({}, defoptions, method)) );
            }

        },

        /**
         *	Trigger event on this object
         */
        trigger : function(string) {
        	if(typeof string === 'string') {
	        	$(this).trigger(string);
        	}
        },

        /**
         *  Cache Methods
         */
        methods : {},

        /**
         *  Cache Ajax methods
         */
        ajaxMethods : {},
        ajaxDeferred : [],
        ajaxEvCount : 0,
        ajaxEvComplete : 0

    };

    /**
     *  fillSelect jquery plugin
     *
     *  @param {object} options
     */
    $.fn.fillSelect = function(options) {
        return this.each(function() {
        	var data = $(this).data('fillSelect') || options;
        	var fillSelect = new FillSelect(this, options);
            return this;
        });
    };

    /**
     *  fillSelect default options
     */
    $.fn.fillSelect.defaults = {
        method : false,                  	// Name of the method to fire
        callback : $.noop,                  // Fired after fill select is completed
        defaultText : 'Select One',         // Default text displayed at the top of the select list. Set to false to disable.
        optionString : 'option'             // Options string. can be set to a function to add default attributes. parameters are value and name.
    };

// EOF
})(jQuery);