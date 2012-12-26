var rsvp = require('rsvp'),
	Promise = rsvp.Promise

exports.pending = function () {
    var pending = new Promise();

    return {
        promise: pending,
        fulfill: pending.resolve.bind(pending),
        reject: pending.reject.bind(pending)
    };
};

exports.createNormal = function () {
	return new Promise()
}

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
