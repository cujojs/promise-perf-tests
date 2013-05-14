var avow = require('avow');

exports.pending = function() {
	var pending = {};

	pending.promise = avow(function(resolve, reject) {
		pending.fulfill = resolve;
		pending.reject = reject;
	});

	return pending;
};

function noop(){}
exports.createNormal = function(){
	return avow(noop)
}

exports.fulfilled = avow.lift;
exports.rejected = avow.reject;