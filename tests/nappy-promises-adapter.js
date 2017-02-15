var promisesAplusTests = require('promises-aplus-tests');

global.nappy = {};
require('../src/js/nappy-promises');

/*
function resolved (value) {
    var promise = nappy.promise(function (resolve, reject) {
        resolve(value);
    });

    return promise;
}

function rejected (reason) {
    var promise = nappy.promise(function (resolve, reject) {
        reject(reason);
    });

    return promise;
}
*/

function deferred() {
    var deferred = {};
    deferred.promise = nappy.promise(function (resolve, reject) {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

var adapter = {
    deferred: deferred
}

module.exports = adapter;

// promisesAplusTests(adapter, function (err) {
//     console.error(err);
// });
