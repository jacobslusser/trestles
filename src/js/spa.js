(function () {
    'use strict';

    var spa = window.spa = {};

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

    var xhr = spa.xhr = {};
    (function () {

        // Default options
        var settings = {
            async: true,
            dataType: 'text',
            method: 'GET'
        }

        xhr.send = function (options, callback) {
            options = utils.extend(settings, options);

            var request = new XMLHttpRequest();
            request.open(options.method, options.url, options.async);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data;
                    switch (options.dataType) {
                        case 'text':
                        case 'html':
                            data = request.responseText;
                            break;
                        case 'json':
                            data = JSON.parse(request.responseText);
                            break;
                    }
                    callback(null, data);
                }
                else {
                    callback('TODO ERROR');
                }
            };

            request.onerror = function () {
                callback('TODO ERROR');
            };

            request.send();
        };
    } ());

    var router = spa.router = {};
    (function () {
        var routes = [];

        function hashChange() {
            var hash = window.location.hash;
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                var result = route.pattern.exec(hash);
                if (result) {
                    route.callback.apply(null, result);
                    break;
                }
            }
        }

        router.on = function (pattern, callback) {
            routes.push({
                pattern: pattern,
                callback: callback
            });
        };

        router.start = function () {
            window.addEventListener('hashchange', hashChange, false);
            hashChange();
        };
    } ());

} ());
