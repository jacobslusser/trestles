(function () {
    'use strict';

    var components = spa.components = {};

    var definitions = {};

    var data = (window.WeakMap ? new window.WeakMap() : (function () {
        var lastId = 0;
        var store = {};

        return {
            set: function (el, info) {
                var id;
                if (el.componentTag === undefined) {
                    id = lastId++;
                    el.componentTag = id;
                }

                store[id] = info;
            },
            get: function (el) {
                return store[el.componentTag];
            }
        };
    } ()));

    function resolveTemplate(name, definition, callback) {
        if (definition.template !== undefined) {
            // Template is already resolved
            callback(null, definition.template);
        }
        else if (definition.templateId !== undefined) {
            // Template is contained in a DOM element
            var el = document.getElementById(definition.templateId);
            callback(null, el.innerHTML);
        }
        else {
            // Load the template from the server. We don't have any dependencies on promises so we
            // use a lightweight synchronization primitive--the presence of a '_listeners' property--
            // as an indicator of a request in flight and a place to queue any continuations.
            if (definition['_listeners'] !== undefined) {
                // A request is already in flight
                definition['_listeners'].push(callback);
            }
            else {
                // Start an AJAX request for the template
                definition['_listeners'] = [callback];
                spa.xhr.send({
                    url: definition.templateUrl,
                    dataType: 'html'
                }, function (err, html) {
                    if (!err) {
                        // Resolve the template
                        definition.template = html;
                    }

                    // Notify listeners
                    var listeners = definition['_listeners'];
                    delete definition['_listeners'];

                    var i = 0, listener;
                    while ((listener = listeners[i++])) {
                        listener(err, html);
                    }
                });
            }
        }
    }

    components.register = function (name, definition) {
        definitions[name] = definition;
    };

    components.remove = function (el, empty) {
        var component = data.get(el);
        if (component && typeof component.controller.dispose === 'function') {
            // Call 'dispose' on the controller being removed
            component.controller.dispose();
        }

        data.set(el, null);
        if (!!empty) {
            el.innerHTML = '';
        }
    };

    components.show = function (el, config, callback) {
        var definition = definitions[config.name];
        resolveTemplate(config.name, definition, function (err, template) {
            if (err) {
                callback(err);
                return;
            }

            try {
                var component = data.get(el);
                if (component && component.name === config.name && typeof component.controller.update === 'function') {
                    // Call 'update' on the current controller instead of replacing the component
                    component.controller.update(config.params);
                    callback(null, component.controller);
                    return;
                }

                // Dispose of the current component, but don't
                // remove the existing HTML to reduce flickering.
                components.remove(el, false);

                // Inject the new template
                el.innerHTML = template;

                // Instantiate the new controller
                var controller = new definition.controller(el, config.params);
                component = {
                    name: config.name,
                    controller: controller
                };

                data.set(el, component);
                callback(null, controller);
            }
            catch (err) {
                callback(err);
            }
        });
    };

} (window.spa = window.spa || {}));
