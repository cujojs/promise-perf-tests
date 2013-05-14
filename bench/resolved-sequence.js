// Sequence from a resolved promise
// Performance of large sequence of then calls from a resolved promise
//
// If a library supports a lighter weight notion of a promise, that
// will be used instead of a full deferred (which is typically more
// expensive)

var array
array = []
var c = 0
while (c < 100) array.push(c++)

module.exports = function (i, done) {
	array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			return currentVal + nextVal
		});
	}, implementation.fulfilled(0)).then(function (result) {
		if (result !== 4950) console.error('fail: '+result)
		done()
	})
}