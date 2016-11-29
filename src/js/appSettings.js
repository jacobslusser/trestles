/**
 * Environment configurations.
 * NOTE: We take a small hit for loading this file separately but it makes maintenance much easier.
 */

(function (appSettings) {
    'use strict';

    appSettings.version = '1.0';
    appSettings.isDebug = true;
    appSettings.isPackaged = false;

}(window.appSettings = window.appSettings || {}));
