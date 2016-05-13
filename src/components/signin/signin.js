(function () {

    function SignIn(el, params) {
        var self = this;
        self.update = update;
        self.dispose = dispose;

        var form = el.querySelectorAll('form')[0];
        form.addEventListener('submit', submit);
        update(params);

        function update(params) {
        };

        function dispose() {
            form.removeEventListener('submit', submit);
        };

        function submit(event) {
            event.preventDefault();
            
            console.log('submit');
        };
    }

    spa.components.register('signin', {
        templateUrl: 'components/signin/signin.html',
        // template: '<h1>Hello Sign In</h1>',
        controller: SignIn
    });

} ());
