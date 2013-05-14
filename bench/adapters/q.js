var q = require('q')
  , defer = q.defer

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

exports.fulfilled = q.resolve;
exports.rejected = q.reject;
