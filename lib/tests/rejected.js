// Create a rejected promise (10,000 iterations)
// Create a promise thats already rejected. Some libraries provide an optimised way of doing this

// Performance of raw promise creation speed. If the library
// provides a lighter weight way to create a resolved promise
// instead of a deferred, it's used here.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

require('../bench')(name, 10000, function (i) {
	lib.rejected(new Error(i.toString()))
})