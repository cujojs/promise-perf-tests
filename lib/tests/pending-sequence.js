// Pending sequence
// How long does it take to create chain of un-resolved promises
//
// Performance of the synchronous component of creating deferreds. 
// For most libraries the synchronous component is all there is but 
// some may not. This test doesn't take those libraries into account

var array = []
for(var i = 1; i < 10000; i++) {
    array.push(i)
}

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

require('../bench')(name, 1, function () {
    // Use reduce to chain <iteration> number of promises back
    // to back.  The final result will only be computed after
    // all promises have resolved
    array.reduce(function(promise, nextVal) {
        return promise.then(function(currentVal) {
            return currentVal + nextVal
        })
    }, lib.pending().promise)
})