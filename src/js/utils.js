(function (app) {
    'use strict';

    var utils = (app.utils = app.utils || {});

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

} (window.app = window.app || {}));
