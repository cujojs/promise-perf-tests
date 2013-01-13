// Create a promise chain of an already resolved promise
// Performance of large sequence of then calls on a resolved promise
//
// If a library supports a lighter weight notion of a promise, that
// will be used instead of a full deferred (which is typically more
// expensive)

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]

/**
 * Load the adapter
 */
var lib = require(process.argv[2])

var array = [];
for(var i = 1; i < 5000; i++) {
	array.push(i);
}

require('../bench')(name, 10, function (i, done) {
	// Use reduce to chain <iteration> number of promises back
	// to back.  The final result will only be computed after
	// all promises have resolved
	array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			// if(nextVal % 1000 === 0) console.log(name, nextVal);
			return currentVal + nextVal
		});
	}, lib.fulfilled(0)).then(function (r) {
		// process.stderr.write(r.toString())
		done()
	})
})