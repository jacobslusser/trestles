/**
 * Environment configurations.
 * NOTE: We take a small hit for loading this file separately but it makes maintenance much easier.
 */

(function (appSettings) {
    'use strict';

    appSettings.debug = true;
    appSettings.version = '1.0';

}(window.appSettings = window.appSettings || {}));
