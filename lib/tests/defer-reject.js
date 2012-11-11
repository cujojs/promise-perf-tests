//
// Performance of raw deferred creation and resolution speed.
// It creates a large number of deferreds, registers a handler
// with each, and then resolves each immediately.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//

var libs, Test, test, when, q, JQDeferred, deferred, d, i, start, iterations;

libs = require('../libs');
Test = require('../test');

iterations = 10000;
test = new Test('defer-reject', iterations);

for(var lib in libs) {
	runTest(lib, libs[lib].pending);
}

test.report();

function runTest(name, createDeferred) {
	var start, d, error = new Error

	start = Date.now();
	for(i = 0; i<iterations; i++) {
		d = createDeferred();
		// laissez logs erros which are not captured
		d.promise.then(addOne, function captureError () {});
		// laissez will not reject unless it is given an Error instance
		d.reject(error);
	}

	test.addResult(name, Date.now() - start);
}

function addOne(x) {
	return x + 1;
}
