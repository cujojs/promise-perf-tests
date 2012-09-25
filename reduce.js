//
// This tests a library-provided promise-aware reduce()
// function, if available.
//
// Note that in my environment, using node v0.8.8, deferred.reduce
// causes a stack overflow for an array length > 598.
//
// when.js's reduce uses Array.prototype.reduce, or a polyfill,
// neither of which uses recursion, thus has no stack depth limitations.

var libs, i, array, expected, iterations;

libs = require('./libs');

iterations = 598;

// > 598 causes stack overflow in deferred.reduce
// iterations = 599;

array = [];
expected = 0;

for(i = 1; i<iterations; i++) {
	expected += i;
	array.push(i);
}

console.log('iterations:', iterations);
console.log('expected computation result:', expected);
console.log('NOTE: See comments in reduce.js for why only 598 iterations\n');

runTest('when.js', libs.when,
	function(val) { return libs.when.resolve(val); }
);

runTest('deferred', libs.deferred,
	function(val) { return libs.deferred(val); }
);

function runTest(name, lib, createPromise) {
	var start = Date.now();

	lib.reduce(array, function(current, next) {
		return createPromise(current + next);
	}, createPromise(0))
	.then(function(result) {
		var end = Date.now() - start;
		console.log(name);
		console.log(' total: ' + end + 'ms');
		console.log(' computation result: ' + result, (expected === result) ? '': '**');
		console.log('');
	});
}
