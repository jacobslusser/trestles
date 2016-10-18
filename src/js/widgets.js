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

    function setStyles(el, rules) {
        for (var ruleName in rules) {
            if (rules.hasOwnProperty(ruleName)) {
                el.style[ruleName] = rules[ruleName];
            }
        }
    }

    function Stage(options) {
        options = extend({}, options);
        var currentActor;

        // Make the target div good for hosting pages out of view
        var stage = options.target;
        setStyles(stage, { position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, overflow: 'hidden' });

        this.transition = function (options) {
            var target = options.target;
            var zIndex = 1;
            if (currentActor) {
                zIndex = getComputedStyle(currentActor)['z-index'];
                zIndex++;
            }

            setStyles(target, { position: 'absolute', width: '100%', height: '100%', 'z-index': zIndex, top: '0', left: '100%', transition: '' });
            stage.appendChild(target);

            setStyles(target, { transition: 'left .4s ease' });
            if (currentActor) {
                setStyles(currentActor, { transition: 'left: .5s ease, opacity: .5s' });
            }

            stage.offsetWidth; // Trigger layout

            setStyles(target, { left: '0' });
            if (currentActor) {
                setStyles(currentActor, { left: '-25%', opacity: '80%' });
            }

            currentActor = target;
        };
    }

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
        Alert: Alert,
        Stage: Stage
    };

} ());
