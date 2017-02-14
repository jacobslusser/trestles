(function () {
    'use strict';

    nappy.nextTick = (function () {
        // TODO improve performance
        if (setImmediate) {
            return setImmediate;
        } else {
            return function (callback) {
                setTimeout(callback, 0);
            };
        }
    }());

    var STATE_PENDING = undefined;
    var STATE_FULFILLED = 1;
    var STATE_REJECTED = 2;

    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = (typeof onFulfilled === 'function' ? onFulfilled : null);
        this.onRejected = (typeof onRejected === 'function' ? onRejected : null);
        this.promise = promise;
    }

    function Promise(resolver) {
        var self = this;

        this.then = function (onFulfilled, onRejected) {
            var promise = new Promise(function () { });

            // Push handler onto queue
            var handler = new Handler(onFulfilled, onRejected, promise);
            if (self.handlers) {
                self.handlers.push(handler);
            } else {
                self.handlers = [handler];
            }

            if (self.state !== STATE_PENDING) {
                // We're already complete (fulfilled or rejected).
                // Process any registered handlers (asynchronously)
                processHandlers();
            }

            return promise;
        };

        function resolve(value) {
            // Ignore calls when already fulfilled or rejected
            if (self.state !== STATE_PENDING) {
                return;
            }

            // The 'promise resolution procedure'.
            // https://promisesaplus.com/#point-45
            if (self === value) {
                return self.reject(new TypeError('A promise cannot be resolved with itself.'));
            } else if (value instanceof Promise) {
                return value.then(resolve, reject);
            } else if (typeof value === 'object' || typeof value === 'function') {
                var then;
                try {
                    then = value.then;
                } catch (e) {
                    return reject(e);
                }
                if (typeof then === 'function') {
                    var done;
                    try {
                        then.call(value, function (y) {
                            if (done) return;
                            done = true;
                            return self.resolve(y);
                        }, function (r) {
                            if (done) return;
                            done = true;
                            return self.reject(r);
                        });
                    } catch (e) {
                        if (done) return;
                        return self.reject(e);
                    }
                }
            }

            // Transition to fulfilled state
            self.state = STATE_FULFILLED;
            self.val = value;

            // Process any registered handlers (asynchronously)
            processHandlers();
        }

        function reject(reason) {
            // Ignore calls when already fulfilled or rejected
            if (self.state !== STATE_PENDING) {
                return;
            }

            // Transition to rejected state
            self.state = STATE_REJECTED;
            self.val = reason;

            // Process any registered handlers (asynchronously)
            processHandlers();
        }

        function onFulfilledFallback(value) {
            return value;
        }

        function onRejectedFallback(reason) {
            throw reason;
        }

        function processHandlers() {
            if (self.handlers && self.handlers.length) {
                var handlers = self.handlers;
                delete self.handlers;

                nappy.nextTick(function () {
                    var handler, callback, result;
                    while (handler = handlers.shift()) {

                        // The 'then' Method
                        // https://promisesaplus.com/#point-21
                        if (self.state === STATE_FULFILLED) {
                            callback = handler.onFulfilled || onFulfilledFallback.bind(self);
                        } else {
                            callback = handler.onRejected || onRejectedFallback.bind(self);
                        }

                        try {
                            result = callback(self.value);
                        } catch (e) {
                            reject.call(handler.promise, e);
                            continue;
                        }

                        resolve.call(handler.promise, result);
                    }
                });
            }
        }

        // Run the user-supplied resolver function to give them the resolve
        // and reject functions they need to complete the promise.
        try {
            resolver(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    nappy.promise = function (resolver) {
        return new Promise(resolver);
    };

}());
