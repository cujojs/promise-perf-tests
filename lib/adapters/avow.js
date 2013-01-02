var avow = require('avow');

// This will work, but may create a slight but unfair perf advantage for avow
//exports.pending = avow;

// So, explicitly mimic other adapters
exports.pending = function () {
	var deferred = avow();
	return {
		promise: deferred.promise,
		fulfill: function (v) {
			deferred.fulfill(v)
		},
		reject: function (v) {
			deferred.reject(v)
		}
	};
};


exports.createNormal = function () {
	return avow()
}

exports.fulfilled = avow.fulfilled;
exports.rejected = avow.rejected;