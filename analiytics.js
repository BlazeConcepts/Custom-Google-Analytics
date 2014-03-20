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
		this.log('EPRESSPACK.Analtics');
		// enable console logging
		this.debug = true;

		this.config = {
			dataAttributes: {
				feature: 'epress-feature'
			}
		};

		this.init();

		if (window.location.hash) {
			var hash = window.location.hash.substring(1);

			if (hash === 'show-analytics') {
				this.displayFeatures();
			}
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
					var action;

					if (EPRESSPACK.Analytics.hasClass(this, 'btn-unclip')) {
						action = 'Unclip | ' + asset.type;
					} else {
						action = 'Clip | ' + asset.type;
					}
					
					var label = asset.title;

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			},
			'download-icon': {
				on: 'click',
				fn: function() {
					var i;
					var asset;
					var id = this.href.split('/').slice(-1);
						// slice return an array object, we need a string
						id = new String(id);
						// last element in the url (image id)
						id = id.split('.')[0];

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings Download';
					var action = 'Download via button | ' + asset.type;
					var label = asset.title;

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			},	
			'download-link': {
				on: 'click',
				fn: function(){
					var i;
					var asset;
					var id = this.href.split('/').slice(-1); // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Clippings Download';
					var action = 'Download via link | ' + asset.type;
					var label = asset.title;

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			},
			email: {
				on: 'click',
				fn: function(){
					var category = 'Clippings';
					var action = 'Email links';
					var label = 'Email links button';

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
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

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			}
		},
		
		elements: 
		{
			'read-more': {
				on: 'click',
				fn: function(){
					var category = 'Content Interaction';
					var action = 'Read more';
					var label = '';


					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			}
		},

		navigation: 
		{
			main: {
				on: 'click',
				fn: function(){
					var category = 'Navigation';
					var action = 'Top Nav Click';
					var label = (this.getAttribute('title') || '');

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			},
			'search-result': {
				on: 'click',
				fn: function(){
					var category = 'Navigation';
					var action = 'Search Result Click';
					var label = (this.getAttribute('title') || '') + ' | ' + (this.getAttribute('data-search-pos') || 'unknown');

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			}
		},

		gallery: {
			'download-link': {
				on: 'click',
				fn: function(){
					var i;
					var asset;
					var id = this.href.split('/').slice(-1); // last element in the url (image id)

					for (i in EPRESSPACK.assets) {
						if (EPRESSPACK.assets[i].id == id) {
							asset = EPRESSPACK.assets[i];
							break;
						}
					}
					
					var category = 'Content Interaction';
					var action = asset.type + ' Dwnld ' + (this.getAttribute('data-track-meta') || '');
					var label = asset.title;

					EPRESSPACK.Analytics.send(category, action, label);

					return true;
				}
			},
		}
	};

	EPRESSPACK.Analytics.prototype.init = function() 
	{
		var elements = this.getElementsWithAttribute(this.config.dataAttributes.feature);
		var i = elements.length;

		while (i--) {
			
			var element = elements[i];
			var dataAttribute = element.getAttribute(this.config.dataAttributes.feature).split(':');
			var feature = dataAttribute[0];
			var event = dataAttribute[1];

			// is the epress feature defined in this.features?
			if (typeof this.features[feature] !== 'object') {
				if (this.debug) {
					alert('could not find element with data attribute `epress-feature` "' + feature + '"');
				}

				continue;
			}

			// is the feature event defined?
			if (typeof this.features[feature][event] !== 'object') {
				if (this.debug) {
					alert('`epress-feature` "' + feature + '" found. Even "' + event + '" not found!');
				}

				continue;
			}

			
			// is there an analytics function?
			if (typeof this.features[feature][event].fn !== 'function') {
				if (this.debug) {
					alert('analyics function `fn` not found for `epress-feature` ' + feature + '.' + event);
				}

				continue;
			}

			// add the event listener to apply the analytics function
			this.addEvent(element, this.features[feature][event].on, function(){
				var dataAttribute = this.getAttribute(EPRESSPACK.Analytics.config.dataAttributes.feature).split(':');
				var feature = dataAttribute[0];
				var event = dataAttribute[1];

				EPRESSPACK.Analytics.features[feature][event].fn.call(this);

				return false;
			});
		}
	};


	EPRESSPACK.Analytics.prototype.send = function (category, action, label)
	{
		if (EPRESSPACK.Analytics.debug) {
			alert('ga(\'send\', \'event\', \'' + category + '\', \'' + action + '\', \'' + label + '\')');
		} else {
			ga('send', 'event', category, action, label);
		}

		return false;
	};


	EPRESSPACK.Analytics.prototype.displayFeatures = function()
	{
		var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = 'table.analytics-table { z-index: 9898989898; position:fixed; top:100px; right:50px;background: #FFF; border: 1px solid lightblue; } table.analytics-table thead th { padding: 5px; border:1px solid lightblue } table.analytics-table tbody td { padding: 0 5px; border:1px solid lightblue}';

		document.getElementsByTagName('head')[0].appendChild(style);


		var i = 0;
		
		var html = '<table class="analytics-table" id="epat">';
			html += '<thead><tr><th>epress-feature</th></tr></thead>';
			html += '<tbody>';

		var feature;
		for (feature in this.features) {
			for (var event in this.features[feature]) {
				html += '<tr>';
				html += '<td>'+feature+':'+event+'</td>';
				html += '</tr>';
			}
		}

		html += '<tr><td><a href="#" onclick="document.getElementById(\'epat\').style = \'display:none\'; return false;">close</a></td></tr>';
		html += '</tbody></table>';

		console.log(window.location);

		document.write(html);
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
				matchingElements.push(allElements[i]);
			}
		}

		return matchingElements;
	};


	EPRESSPACK.Analytics.prototype.hasClass = function (element, className) {
		return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
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
