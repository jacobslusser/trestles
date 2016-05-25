(function (spa) {
    'use strict';

    var xhr = spa.xhr = {};
    xhr.stubs = [];

    // Default options
    var settings = {
        async: true,
        dataType: 'text',
        method: 'GET'
    }

    xhr.send = function (options, callback) {
        options = spa.utils.extend(settings, options);

        var request = new XMLHttpRequest();
        request.open(options.method, options.url, options.async);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var data;
                switch (options.dataType) {
                    case 'text':
                    case 'html':
                        data = request.responseText;
                        break;
                    case 'json':
                        data = JSON.parse(request.responseText);
                        break;
                }
                callback(null, data);
            }
            else {
                callback('TODO ERROR');
            }
        };

        request.onerror = function () {
            callback('TODO ERROR');
        };

        request.send();
    };

} (window.spa = window.spa || {}));
