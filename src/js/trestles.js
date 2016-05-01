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

    // HACK for testing XHR
    /*spa.xhr.send({
        url: 'components/signin/signin.html',
        dataType: 'html'
    }, function(err, data) {
        console.log(err, data);
    });*/

} ());
