var Promise = require('laissez-faire');

// Void the error logging functions
Promise.prepareException = function (failingPromise, error) {};
Promise.cancelException = function (noLongerfailingPromise) {};

var reject = Promise.prototype.reject,
    error = new Error('Special error for Laissez');

exports.pending = function () {
    var promise = new Promise();

    return {
        promise : promise,
        fulfill: function(value) {
            promise.fulfill(value);
        },
        // Decorating the reject method to ensure it only gets run with proper errors
        reject: function (reason) {
            promise.reject(new Error(reason));
        }
    };
};

exports.createNormal = function () {
    return new Promise();
};

exports.fulfilled = function(value) {
	return new Promise().resolve(value);
};
// Laissez needs and error to reject properly
exports.rejected = function(reason) {
	return new Promise().reject(new Error(reason));
};