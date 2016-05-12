(function () {
    'use strict';

    var trestles = window.trestles = {};

    // Register routes
    spa.router.on(/^(#\/)?$/i, function () {
        console.log('root');
    });

    spa.router.on(/^#\/signin\/?$/i, function () {
        console.log('sign-in');
    });

    spa.router.start();

    // HACK for testing components
    spa.components.show(document.body, { name: 'signin' }, function (err, config) {
        console.log(config);
    });

} ());
