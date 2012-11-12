var avow = require('avow');

// This will work, but may create a slight but unfair perf advantage for avow
//exports.pending = avow;

// So, explicitly mimic other adapters
exports.pending = function() {
	var v = avow();
	return {
		promise: v.promise,
		fulfill: v.fulfill,
		reject: v.reject
	};
};
exports.fulfilled = avow.fulfilled;
exports.rejected = avow.rejected;