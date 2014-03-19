/**
 * EPRESSPACK.Toolsbar
 * -------
 * A part of the SDM EPRESSPACK library
 *
 * @author Ian Brindley
 */

window.EPRESSPACK = window.EPRESSPACK || {};

EPRESSPACK.Analytics = (function(){

	EPRESSPACK.Analytics = function(){
		// enable console logging
		this.debug = true;

		this.config = {
			dataAttributes: {
				feature: 'epress-feature',
				event: 'epress-feature-event'
			}
		};

		this.init();

		if (window.location.hash !== '') {
			var hash = window.location.hash.replace('#','');

			console.log(hash);
		}
	};

	EPRESSPACK.Analytics.prototype.features = {
		clippings: 
		{
			clip: {
				on: 'click',
				fn: function() {

					var i;
					var asset;
					var id = this.href.split('/').slice(-1); // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings';
					var action = 'Clip | ' + asset.type;
					var label = asset.title;

					ga('send', 'event', category, action, label);

					return true;
				}
			},
			unclip: {
				on: 'click',
				fn: function() {	
					var i;
					var asset;
					var id = this.href.split('/').slice(-1); // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings';
					var action = 'Unclip | ' + asset.type;
					var label = asset.title;

					ga('send', 'event', category, action, label);

					return true;
				}
			},
			'download-icon': {
				on: 'click',
				fn: function() {
					var i;
					var asset;
					var id = this.href.split('/').slice(-1).split('.')[0]; // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings Download';
					var action = 'Download via button | ' + asset.type;
					var label = asset.title;

					ga('send', 'event', category, action, label);

					return true;
				}
			},	
			'download-link': {
				on: 'click',
				fn: function(){
					var i;
					var asset;
					var id = this.href.split('/').slice(-1).split('.')[0]; // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings Download';
					var action = 'Download via link | ' + asset.type;
					var label = asset.title;

					ga('send', 'event', category, action, label);

					return true;
				}
			},
			'email-links': {

			}
		},

		hotspot: 
		{
			open: {
				on: 'click',
				fn: function(){
					var category = 'Content Interaction';
					var action = 'Hotspot open';
					var label = this.getAttribute('data-title');

					ga('send', 'event', category, action, label);

					return true;
				}
			}
		},
		
		elements: 
		{
			'read-more': {
				on: 'click',
				fn: function(){
					//ga()
				}
			}
		},

		navigation: 
		{
			
		}
	};

	EPRESSPACK.Analytics.prototype.init = function() 
	{
		var elements = this.getElementsWithAttribute(this.config.dataAttributes.feature);
		var i = elements.length;


		while (i--) {
			
			var element = elements[i];
			var feature = element.getAttribute(this.config.dataAttributes.feature);
			var event = element.getAttribute(this.config.dataAttributes.event);

			// is the epress feature defined in this.features?
			if (typeof this.features[feature] !== 'object') {
				if (this.debug) {
					this.log('could not find element with data attribute `epress-feature` "' + feature + '"');
				}

				continue;
			}

			// is the feature event defined?
			if (typeof this.features[feature][event] !== 'object') {
				if (this.debug) {
					this.log('`epress-feature` "' + feature + '" found. Even "' + event + '" not found!');
				}

				continue;
			}

			
			// is there an analytics function?
			if (typeof this.features[feature][event].fn !== 'function') {
				if (this.debug) {
					this.log('analyics function `fn` not found for `epress-feature` ' + feature + '.' + event);
				}

				continue;
			}


			// add the event listener to apply the analytics function
			this.addEvent(element, this.features[feature][event].on, function(){
				var feature = this.getAttribute(EPRESSPACK.Analytics.config.dataAttributes.feature);
				var event = this.getAttribute(EPRESSPACK.Analytics.config.dataAttributes.event);

				EPRESSPACK.Analytics.features[feature][event].fn.call(this);

				return false;
			});
		}
	};


	EPRESSPACK.Analytics.prototype.addEvent = function (element, event, fn)
	{
		if (element.attachEvent) {
			return element.attachEvent('on'+event, fn);
		} else {
			return element.addEventListener(event, fn, false);
		}
	};


	EPRESSPACK.Analytics.prototype.getElementsWithAttribute = function (attribute) 
	{
		var matchingElements = [];
		var allElements = document.getElementsByTagName('*');
		var i = allElements.length;

		while (i--) {
			if (allElements[i].getAttribute(attribute)) {
				// Element exists with attribute. Add to array.
				matchingElements.push(allElements[i]);
			}
		}

		return matchingElements;
	};


	EPRESSPACK.Analytics.prototype.log = function (message)
	{
		if (window.console && console.log) {
			console.log(message);
		}

		return false;
	};

	return new EPRESSPACK.Analytics();
})();


var ga = function(){};
