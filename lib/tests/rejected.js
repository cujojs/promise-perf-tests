// Create a rejected promise (10,000 iterations)
// Some libraries provide an optimised way of doing this
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

require('../bench')(name, 10000, function (i) {
	lib.rejected(new Error(i.toString()))
})