var Promise = require('laissez-faire')

// Void the error logging functions
Promise.prepareException = function (failingPromise, error) {}
Promise.cancelException = function (noLongerfailingPromise) {}

var reject = Promise.prototype.reject,
    error = new Error('Special error for Laissez')

exports.pending = function () {
    var promise = new Promise()

    return {
        children: promise.children,
        promise : promise,
        fulfill: promise.fulfill.bind(promise),
        // Decorating the reject method to ensure it only gets run with proper errors
        reject: function (e) {
            reject.call(this, e instanceof Error ? e : error)
        }
    }
};

exports.createNormal = function () {
    return new Promise()
};

exports.fulfilled = function(value) {
	return new Promise().resolve(value)
};
// Laissez needs and error to reject properly
exports.rejected = function(e) {
	return new Promise().reject(e instanceof Error ? e : error)
};
