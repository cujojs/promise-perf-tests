// State transition -> fulfill (10,000 iterations)
// Transition a pending promise to a fulfilled state

var pending = implementation.pending

var deferreds
before(function(i){
	deferreds = new Array(i)
	// I can't use .map() because it ignores `undefined` items
	while (i) block(--i)
	function block(i){
		var d = deferreds[i] = pending()
		d.promise.then(function () {
			d.__done__()
		})
	}
})

module.exports = function (i, done) {
	deferreds[i-1].__done__ = done
	deferreds[i-1].fulfill(i)
}
