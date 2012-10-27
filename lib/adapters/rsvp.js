var rsvp = require('rsvp');

exports.pending = function () {
    var pending = new rsvp.Promise();

    return {
        promise: pending,
        fulfill: pending.resolve.bind(pending),
        reject: pending.reject.bind(pending)
    };
};

exports.fulfilled = function(value) {
	var pending = new rsvp.Promise();
	pending.resolve(value);
	return pending;
};

exports.rejected = function(reason) {
	var pending = new rsvp.Promise();
	pending.reject(reason);
	return pending;
};
