// State transition -> fulfill (10,000 iterations)
// Transition a pending promise to a fulfilled state

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

var deferreds = new Array(i)
// Create all deferreds before running the test
for (var i = 0; i <= 10000; i++) block(i)
function block (i) {
	deferreds[i] = lib.pending()
	deferreds[i].promise.then(function () {
		deferreds[i].__done__()
	})
}

require('../bench')(name, 10000, function (i, done) {
	deferreds[i].__done__ = done
	deferreds[i].fulfill(i)
})