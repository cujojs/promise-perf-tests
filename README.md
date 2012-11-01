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

[when.js](https://github.com/cujojs/when) no longer uses `Object.freeze()` as of v1.6.0, to avoid this unfortunate [v8-imposed performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects).  It also uses synchronous resolutions.

## Q

[Q](https://github.com/kriskowal/q) calls `Object.freeze` on its promises, and so it incurs the [v8-imposed performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects).  Q also enforces asynchronous resolutions.  This is a safety feature that can help avoid certain types of programmer errors and stack overflows, but at a performance cost since all promise resolutions are delayed until the next turn of the JS event loop.

## RSVP

[RSVP](https://github.com/tildeio/rsvp.js) does asynchronous resolutions, simiarly to Q, but does not use `Object.freeze`

## jQuery Deferred

[jQuery](http://jquery.com) Deferred is not intended to be fully Promises/A compliant in its forwarding behavior.  We've done our best to design the tests so that that does not affect the performance characteristics.  While this *does* affect the *computation results* of some tests, it can be ignored for most performance testing purposes.

It's resolutions are synchronous, and it doesn't use `Object.freeze`

## deferred

[deferred](https://github.com/medikoo/deferred) doesn't use `Object.freeze` and employs synchronous resolution.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.14 installed via homebrew and the following library versions (`npm ls`):

```text
promise-perf-tests@0.3.0 /Users/brian/Projects/cujojs/promise-perf-tests
├─┬ deferred@0.6.1
│ ├── es5-ext@0.9.1
│ ├── event-emitter@0.2.1
│ └── next-tick@0.1.0
├─┬ jquery@1.7.3
│ ├── htmlparser@1.7.6
│ ├─┬ jsdom@0.2.18
│ │ ├─┬ contextify@0.1.3
│ │ │ └── bindings@1.0.0
│ │ ├── cssom@0.2.5
│ │ ├── cssstyle@0.2.3
│ │ └─┬ request@2.11.4
│ │   ├─┬ form-data@0.0.3
│ │   │ ├── async@0.1.9
│ │   │ └─┬ combined-stream@0.0.3
│ │   │   └── delayed-stream@0.0.5
│ │   └── mime@1.2.7
│ ├── location@0.0.1
│ ├── navigator@1.0.1
│ └── xmlhttprequest@1.4.2
├── q@0.8.9
├── rsvp@1.0.0
└── when@1.6.0
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time (computed via `((current - best) / best) * 100)`).

```text
==========================================================
Test: promise-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            3   0.0003        -
deferred        7   0.0007   133.33
rsvp           45   0.0045  1400.00
jquery        116   0.0116  3766.67
q             143   0.0143  4666.67

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            6   0.0006        -
rsvp           54   0.0054   800.00
deferred       79   0.0079  1216.67
jquery        126   0.0126  2000.00
q             157   0.0157  2516.67

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            5   0.0005        -
deferred       16   0.0016   220.00
jquery        151   0.0151  2920.00
rsvp          206   0.0206  4020.00
q             639   0.0639 12680.00

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when            4   0.0004        -
deferred       19   0.0019   375.00
rsvp           58   0.0058  1350.00
jquery        119   0.0119  2875.00
q             255   0.0255  6275.00

==========================================================
Test: defer-resolve x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           32   0.0032        -
jquery        133   0.0133   315.63
rsvp          168   0.0168   425.00
deferred      230   0.0230   618.75
q             791   0.0791  2371.88

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           23   0.0023        -
jquery        138   0.0138   500.00
rsvp          275   0.0275  1095.65
deferred      299   0.0299  1200.00
q             774   0.0774  3265.22

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           11   0.0011        -
jquery        129   0.0129  1072.73
deferred      146   0.0146  1227.27
rsvp          288   0.0288  2518.18
q             979   0.0979  8800.00

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when           10   0.0010        -
deferred       21   0.0021   110.00

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
when           10   0.0010        -
deferred [RangeError: Maximum call stack size exceeded]
```

