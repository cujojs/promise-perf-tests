// Create a fulfilled promise (10,000 iterations)
// Some libraries provide an optimised way of doing this
// 
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.

var createFulfilled = implementation.fulfilled

module.exports = function(i){
	createFulfilled(i)
}
