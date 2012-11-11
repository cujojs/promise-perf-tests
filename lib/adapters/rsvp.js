var rsvp = require('rsvp'),
	Promise = rsvp.Promise

exports.pending = function () {
    var pending = new Promise
    pending.fulfill = pending.resolve
    return pending.promise = pending
};

exports.fulfilled = function(value) {
	var pending = new Promise();
	pending.resolve(value);
	return pending;
};

exports.rejected = function(reason) {
	var pending = new Promise();
	pending.reject(reason);
	return pending;
};
