// State transition -> reject (10,000 iterations)
// Transition a pending promise to rejected state

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

var deferreds = new Array(i)
// Create all deferreds before running the test
for (var i = 0; i <= 10000; i++) deferreds[i] = lib.pending()

require('../bench')(name, 10000, function (i) {
	deferreds[i].reject(new Error(i.toString()))
})
