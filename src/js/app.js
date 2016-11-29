/**
 * Main application module.
 */

(function(app) {
    'use strict';

    var app = this;
    var widgetState = {};
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
        utils.triggerCustomEvent(document, 'widgetstatechange', {
            group: group,
            resource: 'script',
            state: 'complete'
        });
    }

    function requireWidgets(group, callback) {
        if (widgetsScriptState[group] === 'complete' && widgetsTemplateState[group] === 'complete') {
            // The template and script are already loaded
            callback();
        } else {
            // Execute the callback when the script and template are loaded
            document.addEventListener('widgetstatechange', function listener(e) {
                if (widgetsScriptState[group] === 'complete' && widgetsTemplateState[group] === 'complete') {
                    document.removeEventListener('widgetstatechange', listener);
                    callback();
                }
            });

            // If the requests aren't already in flight, start them now
            if (!widgetsScriptState[group]) {
                widgetsScriptState[group] = 'loading';
                utils.triggerCustomEvent(document, 'widgetstatechange', {
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

            if (!widgetsTemplateState[group]) {
                widgetsTemplateState[group] = 'loading';
                utils.triggerCustomEvent(document, 'widgetstatechange', {
                    group: group,
                    resource: 'template',
                    state: 'loading'
                });

                utils.xhr({
                    url: 'widgets/' + group + '.html'
                }, function(err, xhr) {
                    // TODO handle error
                    document.body.insertAdjacentHTML('beforeend', xhr.responseText);
                    widgetsTemplateState[group] = 'complete';
                    utils.triggerCustomEvent(document, 'widgetstatechange', {
                        group: group,
                        resource: 'template',
                        state: 'complete'
                    });
                });
            }
        }
    }

    requireWidgets('external', function(err) {

        // Display the login widget
        var template = document.getElementById('login');
        var host = document.getElementById('main-stage');
        host.innerHTML = '<div>' + template.textContent + '</div>';

        var login = widgets.createLogin(host.firstElementChild);

        var splash = document.getElementById('splash');
        utils.setStyles(splash, { opacity: '0' });
    });

    // Exports
    app.updateWidgetsScriptState = updateWidgetsScriptState;

}.call(window.app = window.app || {}));
