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

    // var alert = new widgets.Alert({
    //     header: 'Unable to connect to Trestles',
    //     content: 'You cannot be signed in at this time. Please check your mobile network settings and try again.'
    // })
    // alert.show();

    var stage = new widgets.Stage({
        target: document.getElementById('main-stage')
    });

    var page = document.getElementById('test-page');
    stage.transition({
        target: page
    });
    page.addEventListener('click', function () {
        var page2 = document.getElementById('test-page2');
        stage.transition({
            target: page2
        });
    });

} (window.trestles = window.trestles || {}));
