// State transition -> fulfill sequence
// Transition a large sequence of pending promises to a fulfilled state.
// Data will be propagated down the sequence


var array
var nums = []
for (var c = 0; c < 100; c++) nums.push(c)

// generate `i` sequences all nice and ready 
// to send a number down 
before(function(i){
	array = []
	while (i--) (function(){
		var def = implementation.pending()
		array.push(def)
		nums.reduce(function(promise, nextVal) {
			return promise.then(function(currentVal) {
				return currentVal + nextVal
			})
		}, def.promise).then(function (res) {
			if (res !== 4950) console.error('wrong answer: '+res)
			def.__done__()
		})
	})()
})

module.exports = function (i, done) {
	array[i-1].__done__ = done
	array[i-1].fulfill(0)
}