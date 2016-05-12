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

    function generateTemplateId(name) {
        return name + '-template';
    }

    function resolveTemplate(name, definition, callback) {
        if (definition.template !== undefined) {
            // Template is already resolved
            callback(definition.template);
        }
        else if (definition.templateId !== undefined) {
            // Template is contained in a DOM element
            var el = document.getElementById(definition.templateId);
            callback(el.innerHTML);
        }
        else {
            // Load the template from the server
            if (definition['_listeners'] !== undefined) {
                // The request is already in flight
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
                        definition.template = html;
                    }

                    var i = 0;
                    var listener;
                    // Notify listeners
                    while ((listener = definition['_listeners'][i++])) {
                        listener(err, html);
                    }

                    delete definition['_listeners'];
                });
            }
        }
    }

    components.register = function (name, definition) {
        definitions[name] = definition;
    };

    components.show = function (el, config, callback) {
        var component = data.get(el);
        var definition = definitions[config.name];
        if (component && component.templateId === definition.templateId && typeof component.controller.update === 'function') {
            // Current controller supports 'update'
            component.controller.update(config.params);
            callback(null, component);
            return;
        }

        if (component && typeof component.controller.dispose === 'function') {
            // Current controller supports 'dispose'
            component.controller.dispose();
        }

        data.set(el, null);

        resolveTemplate(config.name, definition, function (err, template) {
            el.innerHTML = template;
            try {
                var controller = new definition.controller(el, config.params);
                data.set(el, controller);
                callback(null, componment);
            }
            catch (err) {
                callback(err);
            }
        });
    };

} (window.spa = window.spa || {}));
