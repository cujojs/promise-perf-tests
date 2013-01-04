// State transition -> fulfill sequence (10 iterations)
// Transition a large sequence of pending promises to a fulfilled state.
// Data will be propagated down the sequence

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

var array = [];
for(var i = 1; i <= 500; i++) {
	array.push(i);
}
var iterations = 10
// Premade pending sequences
var seqs = []

for (i = 0; i < iterations; i++) block(i)
// Using a function to create a scope
function block () {
	var d = lib.pending()
	array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			// if(nextVal % 100 === 0) process.stderr.write(nextVal.toString())
			return currentVal + nextVal
		})
	}, d.promise).then(function () {
		d.__done__()
	})
	seqs.push(d)
}

require('../bench')(name, iterations, function (i, done) {
	seqs[i-1].__done__ = done
	seqs[i-1].fulfill(0)
})