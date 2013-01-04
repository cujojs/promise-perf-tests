var Promise = require('laissez-faire');

// Void the error logging functions
Promise.onError =
Promise.onCatch = null

exports.pending = function () {
    var promise = new Promise

    return {
        promise : promise,
        fulfill: function(value) {
            promise.resolve(value);
        },
        reject: function (reason) {
            promise.reject(reason);
        }
    };
};

exports.createNormal = function () {
    return new Promise
};

exports.fulfilled = Promise.fulfilled
exports.rejected = Promise.rejected
