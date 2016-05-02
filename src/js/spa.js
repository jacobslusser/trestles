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

    var components = spa.components = {};
    (function () {
        var registry = {};
        var LOAD_STATE_NONE = 0;
        var LOAD_STATE_LOADING = 1;
        var LOAD_STATE_LOADED = 2;

        function getTemplateId(name) {
            return name + '-template';
        }

        function resolveTemplate(config, callback) {
            if (config._templateState === LOAD_STATE_LOADED) {
                // Template has already been loaded
                callback(null, config);
            }
            else if (config._templateState === LOAD_STATE_LOADING) {
                // We're waiting on an async request for the template
                config._templateListeners.push(callback);
            }
            else {
                // The template has never been loaded...
                // Was it included inline or sideloaded?
                var el = document.getElementById(getTemplateId(config.name));
                if (el) {
                    config._templateState = LOAD_STATE_LOADED;
                    config._templateListeners.length = 0;
                    callback(config);
                    return;
                }

                // Start an AJAX request for the template
                config._templateState = LOAD_STATE_LOADING;
                config._templateListeners.push(callback);
                xhr.send({
                    url: config.templateUrl,
                    dataType: 'html'
                }, function (err, html) {

                    // Add the template as a SCRIPT tag
                    var script = document.createElement('script');
                    script.setAttribute('id', getTemplateId(config.name));
                    script.setAttribute('type', 'text/template');
                    script.innerHTML = html;
                    document.body.appendChild(script);

                    // Update the state and process any waiting listeners
                    config._templateState = LOAD_STATE_LOADED;

                    var i = 0;
                    var listener;
                    while ((listener = config._templateListeners[i++])) {
                        listener(null, config);
                    }

                    config._templateListeners.length = 0;
                });
            }
        }

        components.register = function (name, config) {
            registry[name] = utils.extend(config, {
                'name': name,
                '_templateListeners': [],
                '_templateState': LOAD_STATE_NONE
            });
        };

        components.load = function (name, callback) {
            // TODO Look for the constructor function and if not found, load the script
            // TODO Get the template by ID

            // HACK for testing
            var config = registry[name];
            resolveTemplate(config, function (err, config) {
                callback(null, config);
            });
        };
    } ());

} ());
