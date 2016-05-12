(function () {

    function SignIn(el, params) {
        var self = this;
        console.log('hello sign in controller');
        
        self.update = function(params) {
            console.log('update');
        };
        
        self.dispose = function() {
            console.log('dispose');
        };
    }

    spa.components.register('signin', {
        templateUrl: 'components/signin/signin.html',
        // template: '<h1>Hello Sign In</h1>',
        controller: SignIn
    });

} ());
