// jQuery+node hack from: https://github.com/domenic/promise-tests
global.window = require("jsdom").jsdom().createWindow();
var jquery = require("jquery-browserify").Deferred

exports.pending = function () {
	var d = new jquery

	return {
		promise: d.promise(),
		fulfill: function (v) {
			d.resolve(v)
		},
		reject: function (v) {
			d.reject(v)
		}
	};
};

exports.createNormal = function () {
	return new jquery
}

exports.fulfilled = function(value) {
	return new jquery().resolve(value);
};
exports.rejected = function(reason) {
    return new jquery().reject(reason);
};
