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

[avow](https://github.com/briancavalier/avow) is an example [Promises/A+](http://promises-aplus.github.com/promises-spec/) implementation.  In its default configuration, it uses asynchronous resolutions and does not call `Object.freeze`.  However, it can be configured to use synchronous resolutions, and/or `Object.freeze`.  Performance tests are run using the default configuration.

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

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time.
```
Sequence resolve
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ jquery         │           34 │     33949224 │            - │
│ laissez-faire  │           72 │     72028744 │          112 │
│ avow           │           75 │     75286324 │          122 │
│ when           │           99 │     99492889 │          193 │
│ rsvp           │          156 │    156295743 │          360 │
│ deferred       │          159 │    159132310 │          369 │
│ q              │          306 │    306479641 │          803 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a fulfilled promise (10,000 iterations)
Create a promise thats already fulfilled. Some libraries provide an optimised way of doing this
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │          103 │        10262 │            - │
│ laissez-faire  │          174 │        17437 │           70 │
│ deferred       │          323 │        32331 │          215 │
│ q              │          447 │        44704 │          336 │
│ jquery         │          489 │        48937 │          377 │
│ avow           │          542 │        54241 │          429 │
│ rsvp           │          831 │        83099 │          710 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a rejected promise (10,000 iterations)
Create a promise thats already rejected. Some libraries provide an optimised way of doing this
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ q              │           44 │         4427 │            - │
│ laissez-faire  │          110 │        11001 │          149 │
│ when           │          168 │        16759 │          279 │
│ deferred       │          226 │        22638 │          411 │
│ avow           │          498 │        49843 │         1026 │
│ jquery         │          603 │        60255 │         1261 │
│ rsvp           │          779 │        77939 │         1661 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Instantiation (10,000 iterations)
How long does it take to create an instance
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           54 │         5368 │            - │
│ avow           │           92 │         9212 │           72 │
│ when           │          148 │        14803 │          176 │
│ q              │          332 │        33168 │          518 │
│ jquery         │          367 │        36698 │          584 │
│ rsvp           │          631 │        63147 │         1076 │
│ deferred       │          660 │        66003 │         1130 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Pending sequence
How long does it take to create chain of un-resolved promises
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │          145 │    144599017 │            - │
│ avow           │          148 │    147635656 │            2 │
│ when           │          199 │    199195207 │           38 │
│ jquery         │          401 │    401080881 │          177 │
│ rsvp           │          651 │    651292186 │          350 │
│ deferred       │          833 │    833489168 │          476 │
│ q              │          845 │    845178831 │          484 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> reject (10,000 iterations)
How long does it take to go from pending to rejected
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ rsvp           │           22 │         2244 │            - │
│ laissez-faire  │          138 │        13815 │          516 │
│ jquery         │          582 │        58150 │         2491 │
│ q              │          608 │        60767 │         2608 │
│ deferred       │          612 │        61169 │         2626 │
│ avow           │          864 │        86421 │         3751 │
│ when           │          915 │        91486 │         3976 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> fulfill (10,000 iterations)
How long does it take to go from pending to resolved
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            1 │          149 │            - │
│ deferred       │           21 │         2114 │         1319 │
│ jquery         │          207 │        20734 │        13817 │
│ avow           │          574 │        57418 │        38440 │
│ rsvp           │          684 │        68374 │        45794 │
│ when           │          782 │        78213 │        52398 │
│ q              │          919 │        91899 │        61584 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a promise chain of an already resolved promise
Performance of large number of promises chained together
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ per run (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │          307 │    102445646 │            - │
│ jquery         │          442 │    147460347 │           44 │
│ q              │          501 │    167022469 │           63 │
│ laissez-faire  │          511 │    170370066 │           66 │
│ rsvp           │          569 │    189572293 │           85 │
│ deferred       │          840 │    279988250 │          173 │
│ avow           │          873 │    291157843 │          184 │
└────────────────┴──────────────┴──────────────┴──────────────┘
```