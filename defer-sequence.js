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

test = new Test('defer-sequence', iterations);

runTest('when.js',
	function() { return libs.when.defer(); }
);

runTest('Q',
	function() { return libs.q.defer(); }
);

runTest('deferred',
	function() { return libs.deferred(); }
);

runTest('jQuery',
	function() { return new libs.jquery.Deferred(); }
);

test.report();

function runTest(name, createDeferred) {
	var start, d, getPromise;

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

	d = createDeferred();
	d.resolve(0);
	
	// Use reduce to chain <iteration> number of promises back
	// to back.  The final result will only be computed after
	// all promises have resolved
	array.reduce(function(promise, nextVal) {
		return promise.then(function(currentVal) {
			// Uncomment if you want progress indication:
			//if(nextVal % 1000 === 0) console.log(name, nextVal);
			var d = createDeferred();
			d.resolve(currentVal + nextVal);
			return getPromise(d);
		});
	}, getPromise(d));

	test.addResult(name, Date.now() - start);
}