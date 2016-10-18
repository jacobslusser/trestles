(function (trestles) {
    'use strict';

    // Register routes
    spa.router.on(/^(#\/)?$/i, function () {
        console.log('root');
    });

    spa.router.on(/^#\/signin\/?$/i, function () {
        console.log('sign-in');
    });
    
    // Start the app by making a network request. That will tell us if we
    // have network connectivity and/or whether our user is authenticated.

    spa.router.start();

    // HACK for testing components
    /*spa.components.show(document.getElementById('page'), { name: 'signin' }, function (err, controller) {
        if(err) {
            throw err;
        }
        //console.log(controller);
    });*/

    var alert = new widgets.Alert({
        header: 'Unable to connect to Trestles',
        content: 'You cannot be signed in at this time. Please check your mobile network settings and try again.'
    })
    alert.show();

} (window.trestles = window.trestles || {}));
