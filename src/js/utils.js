(function () {
    'use strict';

    var utils = this;
    var xhrDefaults = {
        method: 'GET'
    };

    /**
     * Trigger a custom event.
     * @param {EventTarget} target - The object dispatching the event.
     * @param {string} type - The name of the event.
     * @param {Object} detail - Data to associate with the event. Optional.
     */
    function dispatchCustomEvent(target, type, detail) {
        var event;
        if (window.CustomEvent) {
            event = new CustomEvent(type, { detail: detail });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, true, true, detail);
        }

        target.dispatchEvent(event);
    }

    /**
     * Sends a XHR (AJAX) request.
     * @param {Object} settings - The request settings.
     * @param {Function} callback - The callback to execute when the request is complete.
     */
    function xhr(settings, callback) {
        var request = new XMLHttpRequest();

        request.open(settings.method ? settings.method.toUpperCase() : xhrDefaults.method, settings.url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                callback(null, request);
            } else {
                // We reached our target server, but it returned an error
                callback(new Error('poop'), request);
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            callback(new Error('poop'), request);
        };

        request.send();
    }


    function getStorage(storage) {
        try {
            storage.setItem('test', '1');
            storage.removeItem('test');
            return storage;
        }
        catch (err) {
            // Storage type is not supported
        }
    }

    utils.localStorage = getStorage(window.localStorage);
    utils.sessionStorage = getStorage(window.sessionStorage);
    utils.memoryStorage = (function () {
        var items = {};
        return {
            getItem: function (keyName) {
                return items[keyName];
            },
            setItem: function (keyName, keyValue) {
                items[keyName] = keyValue;
            },
            removeItem: function (keyName) {
                delete items[keyName];
            },
            clear: function () {
                items = {};
            }
        };
    } ());

    utils.setStyles = function (el, rules) {
        for (var ruleName in rules) {
            if (rules.hasOwnProperty(ruleName)) {
                el.style[ruleName] = rules[ruleName];
            }
        }
    };

    // Exports
    utils.dispatchCustomEvent = dispatchCustomEvent;
    utils.xhr = xhr;

}.call(window.utils = window.utils || {}));
