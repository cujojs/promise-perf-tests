# Promise implementation performance tests

This is a set of *basic* performance tests for promise implementations.  As is usually the case, take these with the usual grains of salt.  That said, they should give a reasonable ballpark comparison of the performance characteristics of common, basic operations that most promise libraries provide.

Of course, performance is not the only thing to consider in a promise library.  Interoperability via a proposed standard, such as Promises/A, API convenience, safety, and even code size (for browser applications) are all important, and application-specific considerations.

## Running the tests

Right now, the tests are runnable en masse via the `run.sh` script in unix-like environments, and individually via node in other envs.

### Setup

1. Clone the repo
1. `npm install` to install the promise implementations to be tested
1. Run tests:
    * Run all tests: `run.sh`
    * Run a single test with node: `node <test>`

# Implementation-specific notes

## when.js

The test harness sets [when.js](https://github.com/cujojs/when)'s "paranoid" setting to false.  Currently, the only thing this does is prevent when.js from calling `Object.freeze` on its promises.

We feel this is acceptable because:

1. There is an [outrageous performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects) in v8 for frozen objects--to the point it must  certainly be a bug.  In other environments, there is no such penalty.
1. The other promise libs, except for Q, *do not* freeze their promises, and so they do not incur this v8-imposed penalty.

You can run the tests with when.js in paranoid mode by changing a line in `libs.js`.

## Q

[Q](https://github.com/kriskowal/q) calls `Object.freeze` on its promises, and so it incurs the huge v8-imposed performance penalty (see [above](#whenjs)).  Q also enforces *next-turn resolutions*.  This is a safety feature that can help avoid certain types of programmer errors and stack overflows, but at a performance cost since all promise resolutions are delayed until the next turn of the JS event loop.

## jQuery Deferred

[jQuery](http://jquery.com) Deferred is not intended to be fully Promises/A compliant in its forwarding behavior.  We've done our best to design the tests so that that does not affect the performance characteristics.  While this *does* affect the *computation results* of some tests, it can be ignored for most performance testing purposes.

## deferred

[deferred](https://github.com/medikoo/deferred) bears some similarity to when.js's behavior when running in non-paranoid mode.  It does not use `Object.freeze` and doesn't employ *next-turn resolution*.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.10 installed via homebrew and the following library versions (`npm ls`):

```text
promise-perf-tests@0.1.1 /Users/brian/Projects/cujojs/promise-perf-tests
├─┬ deferred@0.6.0
│ ├── es5-ext@0.9.1
│ ├── event-emitter@0.2.1
│ └── next-tick@0.1.0
├─┬ jquery@1.7.3
│ ├── htmlparser@1.7.6
│ ├─┬ jsdom@0.2.15
│ │ ├─┬ contextify@0.1.3
│ │ │ └── bindings@1.0.0
│ │ ├── cssom@0.2.5
│ │ └─┬ request@2.11.4
│ │   ├─┬ form-data@0.0.3
│ │   │ ├── async@0.1.9
│ │   │ └─┬ combined-stream@0.0.3
│ │   │   └── delayed-stream@0.0.5
│ │   └── mime@1.2.7
│ ├── location@0.0.1
│ ├── navigator@1.0.1
│ └── xmlhttprequest@1.4.2
├── q@0.8.8
└── when@1.5.1
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time (computed via `((current - best) / best) * 100)`).

```text
==========================================================
Test: promise-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         4   0.0004        -
deferred        8   0.0008   100.00
jQuery        130   0.0130  3150.00
Q             141   0.0141  3425.00

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         9   0.0009        -
deferred       87   0.0087   866.67
jQuery        126   0.0126  1300.00
Q             168   0.0168  1766.67

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         6   0.0006        -
deferred       39   0.0039   550.00
jQuery        145   0.0145  2316.67
Q             314   0.0314  5133.33

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        13   0.0013        -
deferred       22   0.0022    69.23
jQuery        125   0.0125   861.54
Q             222   0.0222  1607.69

==========================================================
Test: defer-resolve x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        35   0.0035        -
jQuery        176   0.0176   402.86
deferred      284   0.0284   711.43
Q             703   0.0703  1908.57

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        26   0.0026        -
jQuery        141   0.0141   442.31
deferred      311   0.0311  1096.15
Q             738   0.0738  2738.46

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        24   0.0024        -
deferred      150   0.0150   525.00
jQuery        193   0.0193   704.17
Q             278   0.0278  1058.33

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        17   0.0017        -
deferred       29   0.0029    70.59

==========================================================
Test: reduce-small x 598
NOTE: in node v0.8.8, deferred.reduce causes a
stack overflow for an array length > 598
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         1   0.0017        -
deferred        4   0.0067   300.00

==========================================================
Test: reduce-large x 10000
NOTE: in node v0.8.8, deferred.reduce causes a
stack overflow for an array length > 598
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        16   0.0016        -
deferred [RangeError: Maximum call stack size exceeded]
```
