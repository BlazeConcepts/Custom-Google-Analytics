var CustomGoogleAnalytics = (function ()
{
    "use strict";

    function CustomGoogleAnalytics() 
    {
        this.options = {};
        this.options.elements = {
            'A': {
                event: 'click',
                func: function (){
                    //window.open(this.href, (!this.target ? "_self" : this.target)); 
                    return true;
                }
            },
            'FORM': {
                event: 'submit',
                func: function (){ this.submit(); }
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
                this.log('Invalid argument for Google.track');
        }
    }


    CustomGoogleAnalytics.prototype.trackEvent = function (_class, _ga) {
        var _ga = typeof _ga === 'function' ? _ga : function(){};

        var cgaElements = this.options.elements;
        var elements = this.getByClass(_class); 
        var i = elements.length;

        while (i--) {
            var tag = elements[i].tagName;

            this.addEvent(elements[i], cgaElements[tag].event, function (event) {

                _ga.call(this);
                this.log(_ga.toString());

                setTimeout(cgaElements[tag].func.apply(this), 300);

                return true;
            });
        }

        this.log('Tracking ' + _class);
    }


    CustomGoogleAnalytics.prototype.trackEvents = function (events)
    {
        var objectType = Object.prototype.toString.call(events);

        if (objectType !== '[object Array]') {
            this.log('Invalid events argument. Array expected, ' + objectType + ' given.');
            
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


    CustomGoogleAnalytics.prototype.addEvent = function (element, event, fn)
    {
        if (element.attachEvent) {
            return element.attachEvent('on'+event, fn);
        } else {
            return element.addEventListener(event, fn, false);
        }
    }


    CustomGoogleAnalytics.prototype.log = function (message)
    {
        if (window.console && console.log) {
            console.log(message);
        }

        return false;
    }

    return CustomGoogleAnalytics;
})();

window.Google = new CustomGoogleAnalytics
