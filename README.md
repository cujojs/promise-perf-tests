# Promise implementation performance tests

This is a set of *basic* performance tests for promise implementations.  As is almost always the case, take these with the usual grains of salt.  That said, they should give a reasonable ballpark comparison of the performance characteristics of common, basic operations that most promise libraries provide.

Of course, performance is not the only thing to consider in a promise library.  Interoperability via a proposed standard, such as Promises/A, API convenience, safety, and even code size (for browser applications) are all important, application-specific considerations.

## Running the tests

Right now, the tests are runnable en masse via `npm test` in unix-like environments, and individually via node in other envs.

### Setup

1. Clone the repo
1. `npm install` to install the promise implementations to be tested
1. Run tests:
    * Run all tests: `npm test`
    * Run a single test with node: `node <test>`

# Implementation-specific notes

## when.js

[when.js](https://github.com/cujojs/when) uses synchronous resolutions, and no longer uses `Object.freeze()` as of v1.6.0, to avoid this unfortunate [v8-imposed performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects).

## Q

[Q](https://github.com/kriskowal/q) uses asynchronous resolutions, and calls `Object.freeze` on its promises, and so it incurs the [v8-imposed performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects).

## RSVP

[RSVP](https://github.com/tildeio/rsvp.js) uses asynchronous resolutions, and doesn't use `Object.freeze`.

## deferred

[deferred](https://github.com/medikoo/deferred) uses synchronous resolutions, and doesn't use `Object.freeze`.

## jQuery Deferred

[jQuery](http://jquery.com) uses synchronous resolutions, and it doesn't use `Object.freeze`.

These tests use jQuery via [jquery-browserify](https://github.com/jmars/jquery-browserify), with [jsdom](https://github.com/tmpvar/jsdom) for support.  This approach was taken from the [Promises Test Suite](https://github.com/domenic/promise-tests), and currently, appears to be the only way to use jQuery 1.8.x in node.

jQuery Deferred is not intended to be fully Promises/A compliant in its forwarding behavior.  We've done our best to design the tests so that that does not affect the performance characteristics.  While this *does* affect the *computation results* of some tests, it can be ignored for most performance testing purposes.

## Laisseze-faire

[Laisseze-faire](https://github.com/jkroso/Laissez-faire) uses synchronous resolutions, and it doesn't use `Object.freeze`.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.14 installed via [nvm](https://github.com/creationix/nvm) and the following library versions (`npm ls`):

```text
promise-perf-tests@0.3.0 /Users/brian/Projects/cujojs/promise-perf-tests
├─┬ deferred@0.6.1
│ ├── es5-ext@0.9.1
│ ├── event-emitter@0.2.1
│ └── next-tick@0.1.0
├── jquery-browserify@1.8.1
├─┬ jsdom@0.2.19
│ ├─┬ contextify@0.1.3
│ │ └── bindings@1.0.0
│ ├── cssom@0.2.5
│ ├── cssstyle@0.2.3
│ ├── htmlparser@1.7.6
│ └─┬ request@2.11.4
│   ├─┬ form-data@0.0.3
│   │ ├── async@0.1.9
│   │ └─┬ combined-stream@0.0.3
│   │   └── delayed-stream@0.0.5
│   └── mime@1.2.7
├── q@0.8.9
├── rsvp@1.0.0
└── when@1.6.0
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time (computed via `((current - best) / best) * 100)`).

```text
==========================================================
Test: promise-fulfill x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            4   0.0004        -
deferred        7   0.0007    75.00
rsvp           49   0.0049  1125.00
q             140   0.0140  3400.00
jquery        178   0.0178  4350.00

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            8   0.0008        -
rsvp           49   0.0049   512.50
deferred       64   0.0064   700.00
q             164   0.0164  1950.00
jquery        200   0.0200  2400.00

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            8   0.0008        -
deferred       11   0.0011    37.50
rsvp          205   0.0205  2462.50
jquery        381   0.0381  4662.50
q             631   0.0631  7787.50

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            5   0.0005        -
deferred       22   0.0022   340.00
rsvp           56   0.0056  1020.00
jquery        157   0.0157  3040.00
q             233   0.0233  4560.00

==========================================================
Test: defer-fulfill x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           36   0.0036        -
rsvp          169   0.0169   369.44
deferred      245   0.0245   580.56
jquery        377   0.0377   947.22
q             765   0.0765  2025.00

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           26   0.0026        -
rsvp          155   0.0155   496.15
deferred      312   0.0312  1100.00
jquery        450   0.0450  1630.77
q             772   0.0772  2869.23

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           18   0.0018        -
deferred      160   0.0160   788.89
rsvp          281   0.0281  1461.11
jquery        392   0.0392  2077.78
q            1027   0.1027  5605.56

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           12   0.0012        -
deferred       27   0.0027   125.00

==========================================================
Test: reduce-small x 609
NOTE: in node v0.8.14, deferred.reduce causes a
stack overflow for an array length >= 610
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            1   0.0016        -
deferred        4   0.0066   300.00

==========================================================
Test: reduce-large x 10000
NOTE: in node v0.8.14, deferred.reduce causes a
stack overflow for an array length >= 610
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           12   0.0012        -
deferred [RangeError: Maximum call stack size exceeded]
```

