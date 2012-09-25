//
// This tests a library-provided promise-aware map()
// function, if available.
//

var libs, i, array, iterations;

libs = require('./libs');

iterations = 100000;

array = [];

for(i = 1; i<iterations; i++) {
	array.push(i);
}

console.log('iterations:', iterations);

runTest('when.js', libs.when,
	function(val) { return libs.when.resolve(val); }
);

runTest('deferred', libs.deferred,
	function(val) { return libs.deferred(val); }
);

function runTest(name, lib, createPromise) {
	var start = Date.now();

	lib.map(array, function(value) {
		return createPromise(value * 2);
	}, createPromise(0))
	.then(function(result) {
		var end = Date.now() - start;
		console.log(name);
		console.log(' total: ' + end + 'ms');
		console.log('');
	});
}
