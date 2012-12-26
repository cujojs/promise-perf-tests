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
	var start, d,
		deferreds = new Array(iterations),
		i = iterations
	// Create all deferreds before running the test
	while (i--) deferreds[i] = createDeferred()
	start = process.hrtime()
	for(i = 0; i<iterations; i++) {
		deferreds[i].reject(i);
	}

	test.addResult(name, process.hrtime(start)[1]);
}
