/**
 * Main application module.
 */

(function (app) {
    'use strict';

    var isFirstVisit = true;
    if (app.utils.localStorage) {
        isFirstVisit = app.utils.localStorage.getItem('::firstVisit::') === 'true';
        // localStorage.setIte();
    }

    var mainStage;

    var splash = document.getElementById('splash');
    app.utils.setStyles(splash, { transition: 'opacity 0.4s ease-out' });
    splash.offsetHeight; // Trigger layout
    app.utils.setStyles(splash, { opacity: '0' });

} (window.app = window.app || {}));
