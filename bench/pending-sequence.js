// Sequence from a pending promise
// Performance of large sequence of then calls from a pending promise

var array
before(function(i){
	array = new Array(i)
	while(i) array.push(i--)
})

module.exports = function () {
  // Use reduce to chain `i` promises back to back.
  array.reduce(function(promise, nextVal) {
    return promise.then(function(currentVal) {
      return currentVal + nextVal
    })
  }, implementation.pending().promise)
}