(function () {
    'use strict';

    // Define this function to handle async errors
    nappy.onError = undefined;

    // Asynchronously post an error to the optional 'onError' handler
    // https://github.com/knockout/knockout/blob/v3.4.1/src/utils.js#L359-L364
    nappy.postError = function (err) {
        setTimeout(function () {
            if (nappy.onError) {
                nappy.onError(err);
            } else {
                throw err;
            }
        }, 0);
    };

    // Yep, it's our version of process.nextTick / setImmediate.
    // https://github.com/bluejava/zousan/blob/2.3.3/src/zousan.js
    // https://github.com/knockout/knockout/blob/v3.4.1/src/tasks.js
    // https://github.com/YuzuJS/setImmediate/blob/master/setImmediate.js
    nappy.nextTick = (function () {
        if (typeof setImmediate !== 'undefined') {
            // IE 11+
            return setImmediate;
        } else if (typeof MutationObserver !== 'undefined') {
            // Chrome 27+, Firefox 14+, Opera 15+, Safari 6.1+
            var queue = [];
            var processQueue = function () {
                var queueCopy = queue; queue = []; // Only process what is currently in the queue
                while (queueCopy.length) {
                    var fn = queueCopy.shift();
                    try {
                        fn();
                    } catch (err) {
                        nappy.postError(err);
                    }
                }
            };

            var div = document.createElement('div');
            var observer = new MutationObserver(processQueue);
            observer.observe(div, { attributes: true });

            return function (callback) {
                if (!queue.length) {
                    div.setAttribute('a', 0); // Trigger processing on next tick
                }

                queue.push(callback);
            };
        } else if (document && 'onreadystatechange' in document.createElement('script')) {
            // IE 6-10
            return function (callback) {
                var script = document.createElement('script');
                script.onreadystatechange = function () {
                    script.onreadystatechange = null;
                    document.documentElement.removeChild(script);
                    script = null;
                    callback();
                };
                document.documentElement.appendChild(script);
            };
        } else {
            // Universal (not that we support any of these older browsers)
            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    }());

    function rejectHandler(handler) {

    }

    function Promise(fn) {
        if (fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('Argument must be a function.');
            }

            // Call the user-supplied function with the resolve and reject
            // methods they must call to fulfill or reject the promise.
            var self = this;
            fn(self.resolve, self.reject);
        }
    }

    Promise.prototype.resolve = function (value) {
        if (this.state !== STATE_PENDING) {
            return;
        }
    };

    Promise.prototype.reject = function (reason) {
        if (this.state === STATE_PENDING) {
            this.state = STATE_REJECTED;
            this.value = reason;

            if (this.handlers) {
                this.handlers.forEach(handle);
                this.handlers = null;
            }
        }
    };

    Promise.prototype.done = function (onFulfilled, onRejected) {
        if (this.state === STATE_PENDING) {
            // The promise hasn't resolved yet; queue the callbacks
            if (this.handlers) {
                this.handlers.push(new Handler(onFulfilled, onRejected, promise));
            } else {
                this.handlers = [new Handler(onFulfilled, onRejected, promise)];
            }
        } else {
            // The promise is resolved; run the callbacks on the next tick
            nappy.nextTick(function () {

            });
        }
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var promise = new Promise();
        if (this.state === STATE_PENDING) {
            if (this.handlers) {
                this.handlers.push(new Handler(onFulfilled, onRejected, promise));
            } else {
                this.handlers = [new Handler(onFulfilled, onRejected, promise)];
            }
        }
        else {
            var state = this.state;
            var value = this.value;
            nappy.nextTick(function () {
                if (state == STATE_FUFILLED) {

                } else {

                }
            });
        }

        return promise;
    };

    function promiseResolutionProc(promise, x) {
        if (promise === x) {
            promise.reject(new TypeError('A promise cannot be resolved with itself.'));
        } else if (x instanceof Promise) {
            promise.state = x.state;
            if (promise.state === undefined) {
                (promise.handlers = promise.handlers || []).push()
            } else {

            }
        } else if (typeof x === 'object' || typeof x === 'function') {
            var then;
            try {
                then = x.then;
            } catch (e) {
                promise.reject(e);
                return;
            }
            if (typeof then === 'function ') {
                var done = false;
                try {
                    then.call(x, function resolvePromise(y) {
                        if (done) return;
                        done = true;
                        promiseResolutionProc(promise, y);
                    }, function rejectPromise(r) {
                        if (done) return;
                        done = true;
                        promise.reject(r);
                    });
                } catch (e) {
                    if (done) return;
                    done = true;
                    promise.reject(e);
                }
            } else {
                promise.resolve(x);
            }
        } else {
            promise.resolve(x);
        }
    }

    // Our promise object. I'm intentionally not calling it a 'Promise' because
    // I have no idea whether it is fully Promises/A+ compliant (that would require
    // lots of testing <yawn>), but it is more than enough for our needs.
    // https://www.promisejs.org/implementing/
    function Deferred() {
        var state = PENDING;
        var value = null;
        var handlers = [];

        function getThen(value) {
            var t = typeof value;
            if (value && (t === 'object' || t === 'function')) {
                var then = value.then;
                if (typeof then === 'function') {
                    return then;
                }
            }
            return null;
        }
    }

}());
