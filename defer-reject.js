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

libs = require('./libs');
Test = require('./test');

iterations = 10000;
test = new Test('defer-reject', iterations);

when = libs.when;
q = libs.q;
deferred = libs.deferred;
JQDeferred = libs.jquery.Deferred;

runTest('when.js', function() { return when.defer(); });
runTest('Q', function() { return q.defer(); });
runTest('deferred', function() { return deferred(); }, function(d, x) { d.resolve(new Error(x)); });
runTest('jQuery', function() { return new JQDeferred(); });

test.report();

function runTest(name, createDeferred, rejectDeferred) {
	var start, d, getPromise, reject;

	getPromise = function(def) {
		if(typeof def.promise.then === 'function') {
			getPromise = function(def) { return def.promise; };
		} else {
			getPromise = function(def) { return def.promise(); };
		}

		return getPromise(def);
	};

	reject = rejectDeferred || function(d, x) { d.reject(x); };

	start = Date.now();
	for(i = 0; i<iterations; i++) {
		d = createDeferred();
		getPromise(d).then(addOne);
		reject(d, i);
	}

	test.addResult(name, Date.now() - start);
}

function addOne(x) {
	return x + 1;
}
