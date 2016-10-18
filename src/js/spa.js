(function () {
    'use strict';

    var spa = window.spa = {};

    ///////////////////////////
    // Loader
    ///////////////////////////
    (function () {

        var registry = {};

        this.register = function (name, url, test) {
            registry[name] = {
                url: url,
                test: test
            }
        };

        this.isRegistered = function (name) {
            return !!registry[name];
        };

    }.call(spa.loader = {}));

    var loaderTimeout;
    var requiredScripts = {};
    spa.requireScript = function (url, test, callback) {

        var script = requiredScripts[url];
        if (script.obj) {
            callback(script.obj);
            return;
        }
        else if(script.inProgress) {
            return;
        }
        else {
            requiredScripts[url] = {
                inProgress: true,
                test: test,
                callback: callback
            }

            if(!loaderTimeout) {
                loaderTime = setTimeout(pollFrameworks, 4);
            }
        }
    };


    var utils = spa.utils = {};
    (function () {
        utils.extend = function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i]) {
                    continue;
                }

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }

            return out;
        };
    } ());

} ());
