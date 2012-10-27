//
// This tests a library-provided promise-aware reduce()
// function, if available.
//
// Note that in my environment, using node v0.8.8, deferred.reduce
// causes a stack overflow for an array length > 598.
//
// when.js's reduce uses Array.prototype.reduce, or a polyfill,
// neither of which uses recursion, thus has no stack depth limitations.

var libs, Test, test, i, array, expected, iterations;

libs = require('../libs');
Test = require('../test');

// > 598 causes stack overflow in deferred.reduce
iterations = 10000;

test = new Test('reduce-large', iterations,
	'NOTE: in node v0.8.8, deferred.reduce causes a\nstack overflow for an array length > 598'
);

array = [];
expected = 0;

for(i = 1; i<iterations; i++) {
	expected += i;
	array.push(i);
}

runTest('when.js', libs.when,
	function(val) { return libs.when.resolve(val); }
);

runTest('deferred', libs.deferred,
	function(val) { return libs.deferred(val); }
);

test.report();

function runTest(name, lib, createPromise) {
	var start = Date.now();

	try {
		lib.reduce(array, function(current, next) {
			return createPromise(current + next);
		}, createPromise(0))
		.then(function(result) {
			test.addResult(name, Date.now() - start);
		});
	} catch(e) {
		test.addError(name, e);
	}
}

process.exit(1);