var CustomGoogleAnalytics = (function()
{
    "use strict";


    function CustomGoogleAnalytics () 
    {
        this.options = {};
        this.options.elementType = {
            'A': {
                event: 'onclick',
                func: function(){ window.open(this.href, (!this.target ? "_self" : this.target)); }
            },
            'FORM': {
                event: 'onsubmit',
                func: function(){ this.submit(); }
            }
        };

    }


    CustomGoogleAnalytics.prototype.track = function()
    {

        var argumentType = Object.prototype.toString.call(arguments[0]);

        switch (argumentType) {
            case '[object String]':
                    this.trackEvent(arguments[0], arguments[1]);
                break;

            case '[object Array]':
                    this.trackEvents(arguments[0]);
                break;

            default:
                console.warn('Invalid argument for Google.track');
        }
    }


    CustomGoogleAnalytics.prototype.trackEvent = function (_class, _ga) {
        var _ga = typeof _ga === 'function' ? _ga : function(){};

        var cgaScope = this;
        var cgaElements = cgaScope.options.elementType;

        var elements = this.getByClass(_class), 
            i = elements.length;

        while (i--) {
            var tag = elements[i].tagName;

            elements[i][cgaElements[tag].event] = function (event) {
                event.preventDefault();

                _ga.call(this);

                setTimeout(cgaElements[tag].func.apply(this), 300);
            }
        }

        console.info('Tracking ' + _class);
    }


    CustomGoogleAnalytics.prototype.trackEvents = function (events)
    {
        var objectType = Object.prototype.toString.call(events);

        if (objectType !== '[object Array]') {
            console.warn('Invalid events argument. Array expected, ' + objectType + ' given.');
            
            return false;
        }

        var i = events.length;

        while (i--) {
            this.trackEvent(events[i][0], events[i][1]);
        }

        return true;
    }


    CustomGoogleAnalytics.prototype.getByClass = function (_class)
    { 
        var elements = [];
        var elems = document.getElementsByTagName('*'), i = elems.length;
    
        while (i--) {
            if ((' ' + elems[i].className + ' ').indexOf(' ' + _class + ' ') > -1) {
                elements.push(elems[i]);
            }
        }

        return elements;
    }

    return CustomGoogleAnalytics;
})();

window.Google = new CustomGoogleAnalytics();