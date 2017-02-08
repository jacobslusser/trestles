/**
 * Main application module.
 */

(function() {
    'use strict';

    var app = this;
    var widgetsScriptState = {};
    var widgetsTemplateState = {};

    // var isFirstVisit = true;
    // if (app.utils.localStorage) {
    //     isFirstVisit = app.utils.localStorage.getItem('::firstVisit::') === 'true';
    //     // localStorage.setIte();
    // }

    // var mainStage;



    function updateWidgetsScriptState(group) {
        widgetsScriptState[group] = 'complete';
        utils.dispatchCustomEvent(document, 'widgetstatechange', {
            group: group,
            resource: 'script',
            state: 'complete'
        });
    }

    function requireWidgets(group, callback) {
        if (widgetsScriptState[group] === 'complete' && widgetsTemplateState[group] === 'complete') {
            // The template and script are already loaded
            callback();
            return;
        }

        // Execute the callback when the script and template are loaded
        document.addEventListener('widgetstatechange', function listener(e) {
            if (widgetsScriptState[group] === 'complete' && widgetsTemplateState[group] === 'complete') {
                document.removeEventListener('widgetstatechange', listener);
                callback();
            }
        });

        // Request the script?
        if (!widgetsScriptState[group]) {
            widgetsScriptState[group] = 'loading';
            utils.dispatchCustomEvent(document, 'widgetstatechange', {
                group: group,
                resource: 'script',
                state: 'loading'
            });

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'widgets/' + group + '.js';
            document.head.appendChild(script);
            // See updateWidgetsScriptState
        }

        // Request the template?
        if (!widgetsTemplateState[group]) {
            widgetsTemplateState[group] = 'loading';
            utils.dispatchCustomEvent(document, 'widgetstatechange', {
                group: group,
                resource: 'template',
                state: 'loading'
            });

            utils.xhr({
                url: 'widgets/' + group + '.html'
            }, function(err, xhr) {
                // TODO handle error?
                document.body.insertAdjacentHTML('beforeend', xhr.responseText);
                widgetsTemplateState[group] = 'complete';
                utils.dispatchCustomEvent(document, 'widgetstatechange', {
                    group: group,
                    resource: 'template',
                    state: 'complete'
                });
            });
        }
    }

    // Exports
    app.updateWidgetsScriptState = updateWidgetsScriptState;

    // Start the app
    requireWidgets('external', function(err) {

        // Display the login widget
        var template = document.getElementById('login');
        var host = document.getElementById('main-stage');
        host.innerHTML = '<div>' + template.textContent + '</div>';

        var login = app.createLogin(host.firstElementChild);

        var splash = document.getElementById('splash');
        utils.setStyles(splash, { opacity: '0' });
    });

}.call(window.app = window.app || {}));
