(function () {
    'use strict';

    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    };

    function parseHTML(str) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = str;
        return tmp.body.children;
    };

    function Alert(options) {
        options = extend({}, options);
        var alert = parseHTML(document.getElementById('alert-template').textContent)[0];

        alert.querySelector('.header').innerHTML = '<strong>' + options.header + '</strong>';
        alert.querySelector('.content').innerHTML = '<p>' + options.content + '</p>';

        var button = alert.querySelector('.footer button');
        button.addEventListener('click', close);

        function close() {
            button.removeEventListener('click', close);
            document.body.removeChild(alert);
        }
        
        this.show = function () {
            document.body.insertBefore(alert, document.body.firstChild);
        }

        this.destroy = function () {
            close();
        }
    }

    window.widgets = {
        Alert: Alert
    };

} ());
