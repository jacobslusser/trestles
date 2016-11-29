/**
 * Environment configurations.
 * NOTE: We take a small hit for loading this file separately but it makes maintenance much easier.
 */

(function () {
    'use strict';

    this.version = '1.0';
    this.isDebug = true;
    this.isPackaged = false;

}.call(window.appSettings = window.appSettings || {}));
