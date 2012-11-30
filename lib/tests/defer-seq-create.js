//
// Performance of the synchronous component of creating deferreds. 
// For most libraries the synchronous component is all there is but 
// some may not. This test doesn't take those libraries into account
//

var libs, Test, test, i, array, iterations;

libs = require('../libs');
Test = require('../test');

iterations = 10000;

array = [];
for(i = 1; i<iterations; i++) {
    array.push(i);
}

test = new Test('defer-sequence-create', iterations);

Object.keys(libs).forEach(function(name) {
    runTest(name, libs[name]);
})

test.report(true)

function runTest(name, lib) {
    var start, d = lib.pending();
    // Start timer
    start = process.hrtime()

    // Use reduce to chain <iteration> number of promises back
    // to back.  The final result will only be computed after
    // all promises have resolved
    array.reduce(function(promise, nextVal) {
        return promise.then(function(currentVal) {
            // Uncomment if you want progress indication:
            if(nextVal % 1000 === 0) console.log(name, nextVal);
            return currentVal + nextVal
        })
    }, d.promise)

    test.addResult(name, process.hrtime(start)[1]);
}