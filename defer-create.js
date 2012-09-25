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
}
logResult('when.js', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = q.defer();
}
logResult('Q', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = deferred();
}
logResult('deferred', start);

start = Date.now();
for(i = 0; i<iterations; i++) {
	d = new JQDeferred();
}
logResult('jQuery', start);

function logResult(name, start) {
	var end = Date.now() - start;
	console.log(name);
	console.log(' total: ' + end + 'ms');
	console.log('');
}

// This seems to be necessary as deferred's unresolved promises
// don't allow the process to exit normally.
process.exit(0);