//
// This tests a library-provided promise-aware map()
// function, if available.
//

var libs, Test, test, i, array, iterations;

libs = require('./libs');
Test = require('./test');

iterations = 100000;
test = new Test('map', iterations);

array = [];

for(i = 1; i<iterations; i++) {
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

	lib.map(array, function(value) {
		return createPromise(value * 2);
	}, createPromise(0))
	.then(function() {
		test.addResult(name, Date.now() - start);
	});
}
