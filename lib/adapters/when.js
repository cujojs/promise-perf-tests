var when = require('when');

exports.pending = function () {
    var deferred = when.defer()
    deferred.fulfill = deferred.resolve
    return deferred
};

exports.fulfilled = when.resolve;
exports.rejected = when.reject;

exports.map = when.map;
exports.reduce = when.reduce;