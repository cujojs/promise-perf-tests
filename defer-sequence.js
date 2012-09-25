//
// Performance of large number of *deferred* promises chained together
// to compute a final result.  Promises will resolve sequentially
// with no overlap.
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

var libs, i, array, expected, iterations;

libs = require('./libs');

iterations = 10000;
array = [];
expected = 0;

for(i = 1; i<iterations; i++) {
	expected += i;
	array.push(i);
}

console.log('iterations:', iterations);
console.log('expected computation result:', expected, '\n');

runTest('when.js',
	function() { return libs.when.defer(); },
	function(val) { return libs.when.resolve(val); }
);

runTest('Q',
	function() { return libs.q.defer(); },
	function(val) { return libs.q.resolve(val); }
);

runTest('deferred',
	function() { return libs.deferred(); },
	function(val) { return libs.deferred(val); }
);

runTest('jQuery',
	function() { return new libs.jquery.Deferred(); },
	function(val) { var d = new libs.jquery.Deferred(); d.resolve(val); return d.promise(); }
);

function runTest(name, createDeferred, createPromise) {
	var start, split, p, getPromise;

	// Self-optimizing getPromise to handle API variations
	getPromise = function(def) {
		if(typeof def.promise.then === 'function') {
			getPromise = function(def) { return def.promise; };
		} else {
			getPromise = function(def) { return def.promise(); };
		}

		return getPromise(def);
	};

	// Start timer
	start = Date.now();
	
	// Use reduce to chain <iteration> number of promises back
	// to back.  The final result will only be computed after
	// all promises have resolved
	p = array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			//if(nextVal % 1000 === 0) console.log(name, nextVal);
			var d = createDeferred();
			d.resolve(currentVal + nextVal);
			return getPromise(d);
		});
	}, createPromise(0));

	// Compute how long the raw reduce took
	split = Date.now() - start;

	// Compute how long it takes the promise chain to unwind
	p.then(function(result) {
		var end = Date.now() - start;
		console.log(name);
		console.log(' reduce: ' + split + 'ms');
		console.log(' total: ' + end + 'ms');
		console.log(' avg: ' + (end/iterations) + 'ms');
		console.log(' computation result: ' + result, (expected === result) ? '': '**');
		console.log('');
	});

}