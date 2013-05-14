var when = require('when')
  , defer = when.defer

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

exports.fulfilled = when.resolve;
exports.rejected = when.reject;

exports.map = when.map;
exports.reduce = when.reduce;