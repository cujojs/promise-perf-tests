var deferred = require('deferred');

exports.pending = function () {
	var d = deferred()
	return {
		promise: d.promise,
		fulfill: function (v) {
			d.resolve(v)
		},
		reject: function (v) {
			d.resolve(v)
		}
	};
};

exports.createNormal = function () {
	return deferred()
}

exports.fulfilled = deferred
exports.rejected = deferred

exports.map = deferred.map;
exports.reduce = deferred.reduce;
