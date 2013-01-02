var promise = require('promises-a');

// This will work, but may create a slight but unfair perf advantage
//exports.pending = promise;

// So, explicitly mimic other adapters
exports.pending = function () {
	var deferred = promise();
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
	return promise()
}

exports.fulfilled = function (val) {
	var def = promise();
	def.fulfill(val);
	return def.promise;
};

exports.rejected = function (err) {
	var def = promise();
	def.reject(err);
	return def.promise;
};