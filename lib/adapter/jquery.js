var jquery = require('jquery');

exports.pending = function () {
    var d = new jquery.Deferred();

    return {
        promise: d.promise(),
        fulfill: d.resolve,
        reject: d.reject
    };
};

exports.fulfilled = function(value) {
	return new jquery.Deferred().resolve(value);
};
exports.rejected = function(reason) {
    return new jquery.Deferred().reject(reason);
};
