(function () {

    function SignIn(el, params) {
        console.log('hello sign in controller');
    }

    spa.components.register('signin', {
        templateUrl: 'components/signin/signin.html',
        controller: SignIn
    });

} ());
