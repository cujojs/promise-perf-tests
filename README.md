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
promise-perf-tests@0.1.2 /Users/brian/Projects/cujojs/promise-perf-tests
├─┬ deferred@0.6.1
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
├── q@0.8.9
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
deferred        9   0.0009   125.00
jQuery        145   0.0145  3525.00
Q             153   0.0153  3725.00

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         9   0.0009        -
deferred       89   0.0089   888.89
jQuery        129   0.0129  1333.33
Q             169   0.0169  1777.78

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         6   0.0006        -
deferred       38   0.0038   533.33
jQuery        132   0.0132  2100.00
Q             329   0.0329  5383.33

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        12   0.0012        -
deferred       21   0.0021    75.00
jQuery        121   0.0121   908.33
Q             218   0.0218  1716.67

==========================================================
Test: defer-resolve x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        35   0.0035        -
jQuery        162   0.0162   362.86
deferred      284   0.0284   711.43
Q             712   0.0712  1934.29

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        24   0.0024        -
jQuery        142   0.0142   491.67
deferred      273   0.0273  1037.50
Q             763   0.0763  3079.17

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        23   0.0023        -
jQuery        133   0.0133   478.26
deferred      134   0.0134   482.61
Q             296   0.0296  1186.96

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        16   0.0016        -
deferred       29   0.0029    81.25

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

# Test results - when.js in paranoid mode

For completeness, here are the results of the same tests run with when.js in paranoid mode.  [As noted above](#whenjs), the *only* difference is that in paranoid mode, when.js calls Object.freeze() on promises, thus incurring the associated v8 performance penalty.

Neither deferred nor jQuery freeze their promises.

```text
==========================================================
Test: promise-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred       11   0.0011        -
when.js        68   0.0068   518.18
Q             126   0.0126  1045.45
jQuery        141   0.0141  1181.82

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred       73   0.0073        -
when.js       119   0.0119    63.01
jQuery        129   0.0129    76.71
Q             160   0.0160   119.18

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred       28   0.0028        -
when.js        73   0.0073   160.71
jQuery        184   0.0184   557.14
Q             269   0.0269   860.71

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred       43   0.0043        -
jQuery        105   0.0105   144.19
when.js       147   0.0147   241.86
Q             229   0.0229   432.56

==========================================================
Test: defer-resolve x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
jQuery        226   0.0226        -
deferred      251   0.0251    11.06
when.js       470   0.0470   107.96
Q             760   0.0760   236.28

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
jQuery        141   0.0141        -
deferred      334   0.0334   136.88
when.js       427   0.0427   202.84
Q             750   0.0750   431.91

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
jQuery        134   0.0134        -
deferred      142   0.0142     5.97
when.js       211   0.0211    57.46
Q             287   0.0287   114.18

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred       19   0.0019        -
when.js       168   0.0168   784.21

==========================================================
Test: reduce-small x 598
NOTE: in node v0.8.8, deferred.reduce causes a
stack overflow for an array length > 598
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
deferred        5   0.0084        -
when.js        10   0.0167   100.00

==========================================================
Test: reduce-large x 10000
NOTE: in node v0.8.8, deferred.reduce causes a
stack overflow for an array length > 598
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js       126   0.0126        -
deferred [RangeError: Maximum call stack size exceeded]
```
