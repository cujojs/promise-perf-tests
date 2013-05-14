var Promise = require('promise');

// This will work, but may create a slight but unfair perf advantage
//exports.pending = promise;

// So, explicitly mimic other adapters
exports.pending = function () {
	var deferred = {}
	var p = new Promise(function(fulfill, reject){
		deferred.fulfill = fulfill
		deferred.reject = reject
	});
	deferred.promise = p
	return deferred
};

function noop(){}
exports.createNormal = function () {
	return new Promise(noop)
}

exports.fulfilled = function (val) {
	return new Promise(function(f){f(val)})
};

exports.rejected = function (err) {
	return new Promise(function(_,r){r(err)})
};