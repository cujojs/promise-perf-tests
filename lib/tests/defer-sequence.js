//
// Performance of large number of *deferred* promises chained together
// to compute a final result.  Promises will resolve sequentially
// with no overlap.
//
// Note that jQuery.Deferred.then() is not fully Promises/A compliant
// and so will not compute the correct result.  This is known,
// and should not be a factor in the performance characteristics
// of this test.
//

var libs, Test, test, i, array, iterations;

libs = require('../libs');
Test = require('../test');

iterations = 10000;

array = [];
for(i = 1; i<iterations; i++) {
	array.push(i);
}

test = new Test('defer-sequence', iterations);

test.run(Object.keys(libs).map(function(name) {
	return function() {
		return runTest(name, libs[name]);
	};
}));

function runTest(name, lib) {
	var start, d;
	
	d = lib.pending();
	d.fulfill(0);

	// Start timer
	start = Date.now();

	// Use reduce to chain <iteration> number of promises back
	// to back.  The final result will only be computed after
	// all promises have resolved
	return array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			// if(nextVal % 1000 === 0) console.log(name, nextVal);
			return currentVal + nextVal
		})
	}, d.promise)
	.then(function() {
		test.addResult(name, Date.now() - start);
	})
}