//
// Performance of large number of promises chained together
// to compute a final result.  Promises will resolve sequentially
// with no overlap.
//
// If a library supports a lighter weight notion of a promise, that
// will be used instead of a full deferred (which is typically more
// expensive)
//
// This test outputs 2 times:
//  1) reduce time - the time it takes array.reduce() to execute
//     and create all the promises
//  2) total time - time it takes all the promises to resolve and
//     compute the final result
//
// Note that for Q, these times will always be different since Q
// promises always resolve in a future turn.
//
// Note that jQuery.Deferred.then() is not fully Promises/A compliant
// and so will not compute the correct result.  This is known,
// and should not be a factor in the performance characteristics
// of this test.
//

var libs, Test, test, i, array, expected, iterations;

libs = require('./libs');
Test = require('./test');

iterations = 10000;

array = [];
expected = 0;

for(i = 1; i<iterations; i++) {
	expected += i;
	array.push(i);
}

test = new Test('promise-sequence', iterations,
	'expected computation result: ' + expected);

runTest('when.js',
	function(val) { return libs.when.resolve(val); }
);

runTest('Q',
	function(val) { return libs.q.resolve(val); }
);

runTest('deferred',
	function(val) { return libs.deferred(val); }
);

runTest('jQuery',
	function(val) { return new libs.jquery.Deferred().resolve(val); }
);

test.report();

function runTest(name, createPromise) {
	var start, p;

	// Start timer
	start = Date.now();
	
	// Use reduce to chain <iteration> number of promises back
	// to back.  The final result will only be computed after
	// all promises have resolved
	p = array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			//if(nextVal % 1000 === 0) console.log(name, nextVal);
			return createPromise(currentVal + nextVal);
		});
	}, createPromise(0));

	test.addResult(name, Date.now() - start);
}