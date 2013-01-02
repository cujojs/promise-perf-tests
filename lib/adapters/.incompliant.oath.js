var Deferred = require('oath')

exports.pending = function () {
	var deferred = new Deferred

	return {
		promise : deferred.promise,
		fulfill: function(value) {
			deferred.resolve(value);
		},
		reject: function (reason) {
			deferred.reject(reason);
		}
	};
};

exports.createNormal = function () {
	return new Deferred
};

exports.fulfilled = function(value) {
	var pending = new Deferred
	pending.resolve(value);
	return pending;
};

exports.rejected = function(reason) {
	var pending = new Deferred
	pending.reject(reason);
	return pending;
};
