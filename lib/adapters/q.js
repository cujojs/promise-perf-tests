var q = require('q');

exports.pending = function () {
    var deferred = q.defer();

    return {
        promise: deferred.promise,
        fulfill: deferred.resolve,
        reject: deferred.reject
    };
};

exports.createNormal = function () {
	return q.defer()
}

exports.fulfilled = q.resolve;
exports.rejected = q.reject;
