(function () {

    function SignIn(params) {
        console.log('hello sign in controller');
    }

    // Register
    spa.components.defineController('SignIn', function (params) {
        return new SignIn(params);
    });

} ());
