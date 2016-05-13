(function (trestles) {
    'use strict';

    // Register routes
    spa.router.on(/^(#\/)?$/i, function () {
        console.log('root');
    });

    spa.router.on(/^#\/signin\/?$/i, function () {
        console.log('sign-in');
    });

    spa.router.start();

    // HACK for testing components
    spa.components.show(document.getElementById('page'), { name: 'signin' }, function (err, controller) {
        if(err) {
            throw err;
        }
        //console.log(controller);
    });

} (window.trestles = window.trestles || {}));
