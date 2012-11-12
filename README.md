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

## avow

[avow](https://github.com/briancavalier/avow) is an example Promises/A+ implementation.  In its default configuration, it uses asynchronous resolutions and does not call `Object.freeze`.  However, it can be configured to use synchronous resolutions, and/or `Object.freeze`.  Performance tests are run using the default configuration.

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
├── avow@1.0.0
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
avow           23   0.0023   360.00
rsvp           72   0.0072  1340.00
q             147   0.0147  2840.00
jquery        156   0.0156  3020.00
Should be empty: []

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
laissez         4   0.0004        -
when            8   0.0008   100.00
avow           14   0.0014   250.00
rsvp           52   0.0052  1200.00
deferred       84   0.0084  2000.00
q             159   0.0159  3875.00
jquery        200   0.0200  4900.00

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            8   0.0008        -
laissez        11   0.0011    37.50
deferred       25   0.0025   212.50
avow          105   0.0105  1212.50
rsvp          194   0.0194  2325.00
jquery        447   0.0447  5487.50
q             553   0.0553  6812.50

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            4   0.0004        -
avow           13   0.0013   225.00
laissez        22   0.0022   450.00
deferred       28   0.0028   600.00
rsvp           57   0.0057  1325.00
jquery        155   0.0155  3775.00
q             218   0.0218  5350.00

==========================================================
Test: defer-fulfill x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
avow           28   0.0028        -
when           36   0.0036    28.57
laissez        92   0.0092   228.57
rsvp          164   0.0164   485.71
deferred      207   0.0207   639.29
jquery        387   0.0387  1282.14
q             806   0.0806  2778.57
Should be empty: []

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           26   0.0026        -
avow           28   0.0028     7.69
laissez        36   0.0036    38.46
deferred      289   0.0289  1011.54
rsvp          305   0.0305  1073.08
jquery        369   0.0369  1319.23
q             810   0.0810  3015.38

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           18   0.0018        -
laissez        40   0.0040   122.22
avow           98   0.0098   444.44
deferred      177   0.0177   883.33
rsvp          280   0.0280  1455.56
jquery        435   0.0435  2316.67
q             923   0.0923  5027.78

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

