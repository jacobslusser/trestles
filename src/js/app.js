/**
 * Main application module.
 */

(function (app) {
    'use strict';

    var utils = app.utils = (function () {

        return {
            setStyles: function (el, rules) {
                for (var ruleName in rules) {
                    if (rules.hasOwnProperty(ruleName)) {
                        el.style[ruleName] = rules[ruleName];
                    }
                }
            }
        };
    } ());

    var splash = document.getElementById('splash');
    utils.setStyles(splash, { transition: 'opacity 0.4s ease-out' });
    splash.offsetHeight; // Trigger layout
    utils.setStyles(splash, { opacity: '0' });

} (window.app = window.app || {}));
