//
// Performance of raw deferred creation and resolution speed.
// It creates a large number of deferreds, registers a handler
// with each, and then resolves each immediately.
//
// This test DOES NOT care about when all the promises
// have actually resolved (e.g. Q promises always resolve in a
// future turn).  This is a pure, brute force sync code test.
//

var libs, when, q, JQDeferred, deferred, d, i, start, iterations;

libs = require('./libs');

iterations = 10000;

console.log('iterations:', iterations, '\n');

when = libs.when;
q = libs.q;
deferred = libs.deferred;
JQDeferred = libs.jquery.Deferred;

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = when.defer();
	d.promise.then(addOne);
	d.resolve(i);
}
logResult('when.js', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = q.defer();
	d.promise.then(addOne);
	d.resolve(i);
}
logResult('Q', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = deferred();
	d.promise.then(addOne);
	d.resolve(i);
}
logResult('deferred', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = new JQDeferred();
	d.promise().then(addOne);
	d.resolve(i);
}
logResult('jQuery', start);

function addOne(x) {
	return x + 1;
}

function logResult(name, start) {
	var end = Date.now() - start;
	console.log(name);
	console.log(' total: ' + end + 'ms');
	console.log('');
}