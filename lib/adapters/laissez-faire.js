var Promise = require('laissez-faire')

exports.pending = function () {
    var pending = new Promise()
    pending.fulfill = pending.resolve
    return pending.promise = pending
};

exports.fulfilled = function(value) {
	return new Promise().resolve(value)
};

exports.rejected = function(reason) {
	return new Promise().reject(reason)
};
