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

The test harness sets when.js's "paranoid" setting to false.  Currently, the only thing this does is prevent when.js from calling `Object.freeze` on its promises.

We feel this is acceptable because:

1. There is an [outrageous performance penalty](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects) in v8 for frozen objects--to the point it must  certainly be a bug.  In other environments, there is no such penalty.
1. The other promise libs, except for Q, *do not* freeze their promises, and so they do not incur this v8-imposed penalty.

You can run the tests with when.js in paranoid mode by changing a line in `libs.js`.

## Q

Q calls `Object.freeze` on its promises, and so it incurs the huge v8-imposed performance penalty (see [above](#whenjs)).  Q also enforces *next-turn resolutions*.  This is a safety feature that can help avoid certain types of programmer errors and stack overflows, but at a performance cost since all promise resolutions are delayed until the next turn of the JS event loop.

## jQuery Deferred

jQuery Deferred is not intended to be fully Promises/A compliant in its forwarding behavior.  We've done our best to design the tests so that that does not affect the performance characteristics.  However, it *does* affect the *computation results* of some tests.  These are noted in the output and can be ignored for performance testing purposes.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.10 installed via homebrew and the following library versions (`npm ls`):

```text
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
└── when@1.5.0
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time (computed via `((current - best) / best) * 100)`).

```text
==========================================================
Test: promise-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         5   0.0005        -
deferred       17   0.0017   240.00
jQuery        127   0.0127  2440.00
Q             143   0.0143  2760.00

==========================================================
Test: promise-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         8   0.0008        -
deferred       88   0.0088  1000.00
jQuery        128   0.0128  1500.00
Q             171   0.0171  2037.50

==========================================================
Test: promise-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js         7   0.0007        -
deferred       37   0.0037   428.57
jQuery        134   0.0134  1814.29
Q             309   0.0309  4314.29

==========================================================
Test: defer-create x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        18   0.0018        -
deferred       20   0.0020    11.11
jQuery        133   0.0133   638.89
Q             233   0.0233  1194.44

==========================================================
Test: defer-resolve x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        63   0.0063        -
jQuery        183   0.0183   190.48
deferred      276   0.0276   338.10
Q             783   0.0783  1142.86

==========================================================
Test: defer-reject x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        47   0.0047        -
jQuery        140   0.0140   197.87
deferred      343   0.0343   629.79
Q             754   0.0754  1504.26

==========================================================
Test: defer-sequence x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        33   0.0033        -
deferred      135   0.0135   309.09
jQuery        153   0.0153   363.64
Q             296   0.0296   796.97

==========================================================
Test: map x 10000
----------------------------------------------------------
Name      Time ms   Avg ms   Diff %
when.js        19   0.0019        -
deferred       34   0.0034    78.95

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
when.js        19   0.0019        -
deferred [RangeError: Maximum call stack size exceeded]
```
