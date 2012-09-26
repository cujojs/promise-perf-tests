//
// Performance of raw deferred creation speed.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//
// Note: it appears as if unresolved deferred()s prevent the
// process from exiting when execution reaches the end of this
// file, hence the process.exit().
// It's not clear at this time whether that is the intended
// behavior or not, but it does not appear to affect the test
// results.
//

var libs, Test, test, when, q, JQDeferred, deferred, d, i, start, iterations;

libs = require('./libs');
Test = require('./test');

iterations = 10000;
test = new Test('defer-create', iterations);

when = libs.when;
q = libs.q;
deferred = libs.deferred;
JQDeferred = libs.jquery.Deferred;

runTest('when.js', function() { return when.defer(); });
runTest('Q', function() { return q.defer(); });
runTest('deferred', function() { return deferred(); });
runTest('jQuery', function() { return new JQDeferred(); });

test.report();

function runTest(name, createDeferred) {
	var start;

	start = Date.now();
	for(i = 0; i<iterations; i++) {
		createDeferred();
	}

	test.addResult(name, Date.now() - start);
}

// This seems to be necessary as deferred's unresolved promises
// don't allow the process to exit normally.
process.exit(0);