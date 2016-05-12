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
    spa.components.show(document.getElementById('sign-in'), { name: 'signin' }, function (err, controller) {
        if(err) {
            throw err;
        }
        //console.log(controller);
    });
    spa.components.show(document.getElementById('sign-in'), { name: 'signin' }, function (err, controller) {
        //console.log(controller);
        if(err) {
            throw err;
        }
    });

} ());
