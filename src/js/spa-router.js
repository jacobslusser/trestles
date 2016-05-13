(function (spa) {
    'use strict';

    var router = spa.router = {};

    var routes = [];

    function hashChange() {
        var hash = window.location.hash;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var result = route.pattern.exec(hash);
            if (result) {
                route.callback.apply(null, result);
                break;
            }
        }
    }
    
    router.before = function () {
        
    };

    router.on = function (pattern, callback) {
        routes.push({
            pattern: pattern,
            callback: callback
        });
    };

    router.start = function () {
        window.addEventListener('hashchange', hashChange, false);
        hashChange();
    };

}(window.spa = window.spa || {}));
