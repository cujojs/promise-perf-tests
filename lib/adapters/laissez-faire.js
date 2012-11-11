var Promise = require('laissez-faire')
// Void the error logging functions
Promise.prepareException = function (failingPromise, error) {}
Promise.cancelException = function (noLongerfailingPromise) {}

exports.pending = function () {
    var pending = new Promise()
    pending.fulfill = pending.resolve
    return pending.promise = pending
};

exports.fulfilled = function(value) {
	return new Promise().resolve(value)
};
// Laissez needs and error to reject properly
var reason = new Error
exports.rejected = function() {
	return new Promise().reject(reason)
};
