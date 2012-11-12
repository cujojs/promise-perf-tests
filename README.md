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

## laissez-faire

[lassez-faire](https://github.com/jkroso/Laissez-faire) uses synchronous resolutions, and doesn't use `Object.freeze`.

## jQuery Deferred

[jQuery](http://jquery.com) uses synchronous resolutions, and it doesn't use `Object.freeze`.

These tests use jQuery via [jquery-browserify](https://github.com/jmars/jquery-browserify), with [jsdom](https://github.com/tmpvar/jsdom) for support.  This approach was taken from the [Promises Test Suite](https://github.com/domenic/promise-tests), and currently, appears to be the only way to use jQuery 1.8.x in node.

jQuery Deferred is not intended to be fully Promises/A compliant in its forwarding behavior.  We've done our best to design the tests so that that does not affect the performance characteristics.  While this *does* affect the *computation results* of some tests, it can be ignored for most performance testing purposes.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.14 installed via [nvm](https://github.com/creationix/nvm) and the following library versions (`npm ls`):

```text
promise-perf-tests@0.3.1 /Users/brian/Projects/cujojs/promise-perf-tests
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
├── laissez-faire@0.1.2
├── q@0.8.9
├── rsvp@1.0.0
└── when@1.6.1
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time (computed via `((current - best) / best) * 100)`).

```text
==========================================================
Test: promise-fulfill x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            5   0.0005        -
laissez         5   0.0005        -
deferred        7   0.0007    40.00
rsvp           48   0.0048   860.00
q             144   0.0144  2780.00
jquery        175   0.0175  3400.00

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
laissez         4   0.0004        -
when            8   0.0008   100.00
rsvp           47   0.0047  1075.00
deferred       63   0.0063  1475.00
q             166   0.0166  4050.00
jquery        197   0.0197  4825.00

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            8   0.0008        -
laissez         9   0.0009    12.50
deferred       27   0.0027   237.50
rsvp          205   0.0205  2462.50
jquery        407   0.0407  4987.50
q             613   0.0613  7562.50

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            5   0.0005        -
laissez        19   0.0019   280.00
deferred       21   0.0021   320.00
rsvp           59   0.0059  1080.00
jquery        158   0.0158  3060.00
q             243   0.0243  4760.00

==========================================================
Test: defer-fulfill x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           38   0.0038        -
laissez        40   0.0040     5.26
rsvp          165   0.0165   334.21
deferred      239   0.0239   528.95
jquery        381   0.0381   902.63
q             751   0.0751  1876.32

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           26   0.0026        -
laissez        85   0.0085   226.92
rsvp          216   0.0216   730.77
deferred      302   0.0302  1061.54
jquery        367   0.0367  1311.54
q             752   0.0752  2792.31

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           17   0.0017        -
laissez        40   0.0040   135.29
deferred      166   0.0166   876.47
rsvp          285   0.0285  1576.47
jquery        423   0.0423  2388.24
q             985   0.0985  5694.12

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           12   0.0012        -
deferred       28   0.0028   133.33

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
when           13   0.0013        -
deferred [RangeError: Maximum call stack size exceeded]
```

