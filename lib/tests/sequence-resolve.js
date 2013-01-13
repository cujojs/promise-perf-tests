// Sequence resolve
// 
// Performance of large number of *deferred* promises chained together
// to compute a final result.  Promises will resolve sequentially
// with no overlap.
//
// Note that jQuery.Deferred.then() is not fully Promises/A compliant
// and so will not compute the correct result.  This is known,
// and should not be a factor in the performance characteristics
// of this test.
//

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

var array = [];
for(var i = 1; i <= 922; i++) {
	array.push(i);
}

var d = lib.pending()
// Use reduce to chain <iteration> number of promises back
// to back. The final result will only be computed after
// all promises have resolved
var last = array.reduce(function(promise, nextVal) {
	return promise.then(function(currentVal) {
		// Uncomment if you want progress indication:
		// if(nextVal % 10 === 0) console.log(nextVal)
		return currentVal + nextVal
	})
}, d.promise)

require('../bench')(name, 1, function (i, done) {
	d.fulfill(0)
	last.then(done)
})