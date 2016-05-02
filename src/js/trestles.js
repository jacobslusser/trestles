(function () {
    'use strict';

    var trestles = window.trestles = {};

    // Register components
    spa.components.register('signin', {
        templateUrl: 'components/signin/signin.html'
    });

    // Register routes
    spa.router.on(/^(#\/)?$/i, function () {
        console.log('root');
    });

    spa.router.on(/^#\/signin\/?$/i, function () {
        console.log('sign-in');
    });

    spa.router.start();

    // HACK for testing components
    /*spa.components.load('signin', function (err, config) {
        console.log(config);
    });
    spa.components.load('signin', function (err, config) {
        console.log(config);
    });*/

} ());
