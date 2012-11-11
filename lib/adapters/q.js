var q = require('q');

exports.pending = function () {
    var deferred = q.defer();
    deferred.fulfill = deferred.resolve
    return deferred
};

exports.fulfilled = q.resolve;
exports.rejected = q.reject;
