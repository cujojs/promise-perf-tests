var promise = require('micro-promise/core')
  , defer = promise.defer

exports.pending = function () {
	var deferred = defer();

	return {
		promise: deferred.promise,
		fulfill: function (v) {
			deferred.resolve(v)
		},
		reject: function (v) {
			deferred.reject(v)
		}
	};
};

exports.createNormal = function () {
	return defer()
}

exports.fulfilled = promise.resolve;
exports.rejected = promise.reject;