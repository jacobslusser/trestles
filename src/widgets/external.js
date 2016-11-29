(function () {
    'use strict';

    var widgets = this;

    function Login(el) {

    }

    // Exports
    widgets.createLogin = function (el) { return new Login(el); };
    
    // Complete
    app.updateWidgetsScriptState('external');

}.call(window.widgets = window.widgets || {}));