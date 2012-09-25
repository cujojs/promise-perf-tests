//
// Performance of raw *rejected* promise creation speed.  If the library
// provides a lighter weight way to create a rejected promise
// instead of a deferred, it's used here.
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
	d = when.reject(i);
}
logResult('when.js', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = q.reject(i);
}
logResult('Q', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = deferred(new Error(i));
}
logResult('deferred', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = new JQDeferred().reject(i).promise();
}
logResult('jQuery', start);

function logResult(name, start) {
	var end = Date.now() - start;
	console.log(name);
	console.log(' total: ' + end + 'ms');
	console.log('');
}