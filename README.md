Custom Google Analytics
==============================

Apply custom google analytic tracking to specified elements.



Examples
---------

Track navigation links (`<a>`) identified by a class name of `ga-navigation`

```javascript
Google.track('ga-navigation', function(){
	// this function has the context of the html element, making it's attributes easily accessible!
	ga('send', 'event', 'link', 'click', { 'page': this.href });
});
```

Track form submissions, (`<form>`) identified by a class of `ga-form`

```javascript
Google.track('ga-form', function(){ 
	ga('send', 'event', 'form', 'submit', { 'page': this.action });
});
```

Note that CustomGoogleAnalytics attaches eventHandlers to DOM elements, therefore the DOM needs to be loaded before applying any custom analytics.

```javascript
window.onload = function() {
	Google.track('ga-navigation', function(){
		// this function has the context of the html element, making it's attributes easily accessible!
		ga('send', 'event', 'link', 'click', { 'page': this.href });
	});

	Google.track('ga-form', function(){ 
		ga('send', 'event', 'form', 'submit', { 'page': this.action });
	});
}
```

CustomGoogleAnalytics can also accept an array of elements in the track method.

```javascript
Google.track([
	['ga-navigation', function(){
		ga('send', 'event', 'link', 'click', { 'page': this.href });
	}],

	['ga-form', function(){
		ga('send', 'event', 'form', 'submit', { 'page': this.action });
	}]
]);
```
