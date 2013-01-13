//
// This tests a library-provided promise-aware reduce()
// function, if available.
//
// Note that in my environment, using node v0.8.14, deferred.reduce
// causes a stack overflow for an array length >= 610.
//

var libs, Test, test, i, array, expected, iterations;

libs = require('../libs');
Test = require('../test');

// Causes stack overflow in deferred.reduce
// iterations = 610;
iterations = 546;

array = [];
expected = 0;

for(i = 1; i<iterations; i++) {
	expected += i;
	array.push(i);
}

test = new Test('reduce-small', iterations,
	'NOTE: in node v0.8.14, deferred.reduce causes a\nstack overflow for an array length >= 610'
);
test.run(Object.keys(libs).filter(function(name) {
	return libs[name].reduce;
}).map(function(name) {
	return function() {
		return runTest(name, libs[name]);
	};
}));

function runTest(name, lib) {
	var start = Date.now();

	return lib.reduce(array, function(current, next) {
		return lib.fulfilled(current + next);
	}, lib.fulfilled(0))
		.then(
			function(result) {
				test.addResult(name, Date.now() - start);
			},
			function(e) {
				test.addError(name, e);
			}
	);
}
