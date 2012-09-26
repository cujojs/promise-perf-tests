//
// Performance of raw *rejected* promise creation speed.  If the library
// provides a lighter weight way to create a rejected promise
// instead of a deferred, it's used here.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//

//
// Performance of raw promise creation speed.  If the library
// provides a lighter weight way to create a resolved promise
// instead of a deferred, it's used here.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//

var libs, Test, test, when, q, JQDeferred, deferred, d, i, start, iterations;

libs = require('./libs');
Test = require('./test');

iterations = 10000;
test = new Test('promise-reject', iterations);

when = libs.when;
q = libs.q;
deferred = libs.deferred;
JQDeferred = libs.jquery.Deferred;

runTest('when.js', function(x) { return when.reject(x); });
runTest('Q', function(x) { return q.reject(x); });
runTest('deferred', function(x) { return deferred(new Error(x)); });
runTest('jQuery', function(x) { return new JQDeferred().reject(x).promise(); });

test.report();

function runTest(name, createPromise) {
	var start;

	start = Date.now();
	for(i = 0; i<iterations; i++) {
		createPromise(i);
	}

	test.addResult(name, Date.now() - start);
}
