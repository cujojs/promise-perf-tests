# Promise implementation performance tests

This is a set of *basic* performance tests for promise implementations.  As is almost always the case, take these with the usual grains of salt.  That said, they should give a reasonable ballpark comparison of the performance characteristics of common, basic operations that most promise libraries provide.

Of course, performance is not the only thing to consider in a promise library.  Interoperability via a proposed standard, such as Promises/A, API convenience, safety, and even code size (for browser applications) are all important, application-specific considerations.

## Running the tests

Right now, the tests are runnable en masse via `npm test` in unix-like environments, and individually via node in other envs.

### Setup

1. Clone the repo
1. `npm install` to install the promise implementations to be tested
1. Run tests:
    * Run all tests: `bin/pperf`
    * Run a single test: `bin/pperf -t <test>`
    * Run a single implementation `bin/pperf -a <implementation>`
    * Print available tests and implementations `bin/pperf -h`

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

[Laisseze-faire](https://github.com/jkroso/Laissez-faire) uses synchronous resolutions, and it doesn't provide proxies by default.

## Micro-promise

Uses synchronous resolutions an doesn't freeze its objects.

# Test Environment

These tests were run on a MacBook Pro Intel Core i7, 2.3Ghz, 8g RAM, 256g SSD, using Node.js v0.8.14 installed via [nvm](https://github.com/creationix/nvm) and the following library versions (`npm ls`):

```
├── avow@1.0.0
├── b@2.0.0
├─┬ cli-table@0.2.0
│ └── colors@0.3.0
├── colors@0.6.0-1
├─┬ commander@1.1.1
│ └── keypress@0.1.0
├─┬ deferred@0.6.1
│ ├── es5-ext@0.9.1
│ ├── event-emitter@0.2.1
│ └── next-tick@0.1.0
├── exec@0.0.4
├── jquery-browserify@1.8.1
├─┬ jsdom@0.3.4
│ ├─┬ contextify@0.1.3
│ │ └── bindings@1.0.0
│ ├── cssom@0.2.5
│ ├── cssstyle@0.2.3
│ ├── htmlparser@1.7.6
│ ├── nwmatcher@1.3.0
│ └─┬ request@2.12.0
│   ├─┬ form-data@0.0.5
│   │ ├── async@0.1.22
│   │ └─┬ combined-stream@0.0.3
│   │   └── delayed-stream@0.0.5
│   └── mime@1.2.7
├── laissez-faire@0.8.2
├── micro-promise@0.1.0
├── promises-a@2.3.0
├─┬ promisify@0.1.0
│ └── sliced@0.0.3
├── q@0.8.12
├── randy@1.4.0
├── rsvp@1.1.0
├── stripcolorcodes@0.1.0
└── when@1.7.1

```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time.

```
Create a fulfilled promise (10,000 iterations)
Some libraries provide an optimised way of doing this

This test DOES NOT care about when all the promises
have actually resolved (e.g. Q promises always resolve in a
future turn).  This is a pure, brute force sync code test.
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            2 │          181 │            - │
│ when           │            8 │          755 │          318 │
│ promises-a     │           11 │         1074 │          494 │
│ deferred       │           22 │         2243 │         1140 │
│ avow           │           29 │         2885 │         1495 │
│ micro-promise  │           87 │         8667 │         4693 │
│ rsvp           │          141 │        14062 │         7677 │
│ q              │          205 │        20515 │        11246 │
│ jquery         │          288 │        28788 │        15821 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a pending promise (10,000 iterations)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            1 │           78 │            - │
│ avow           │            6 │          632 │          707 │
│ promises-a     │            7 │          737 │          841 │
│ when           │            8 │          780 │          897 │
│ deferred       │           40 │         3988 │         4992 │
│ rsvp           │           44 │         4428 │         5553 │
│ micro-promise  │           78 │         7803 │         9863 │
│ jquery         │          268 │        26802 │        34121 │
│ q              │         2898 │       289800 │       369918 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a rejected promise (10,000 iterations)
Some libraries provide an optimised way of doing this

This test DOES NOT care about when all the promises
have actually resolved (e.g. Q promises always resolve in a
future turn).  This is a pure, brute force sync code test.
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ deferred       │          141 │        14144 │            - │
│ promises-a     │          142 │        14191 │            0 │
│ laissez-faire  │          146 │        14589 │            3 │
│ avow           │          189 │        18920 │           34 │
│ when           │          227 │        22688 │           60 │
│ micro-promise  │          272 │        27163 │           92 │
│ rsvp           │          341 │        34114 │          141 │
│ q              │          509 │        50897 │          260 │
│ jquery         │          543 │        54275 │          284 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence from a pending promise
Performance of large sequence of then calls from a pending promise
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            8 │      8246915 │            - │
│ avow           │           11 │     11441054 │           39 │
│ promises-a     │           12 │     11941337 │           45 │
│ when           │           14 │     13879157 │           68 │
│ deferred       │           61 │     61271013 │          643 │
│ rsvp           │           73 │     73076745 │          786 │
│ micro-promise  │          237 │    237219412 │         2776 │
│ jquery         │          915 │    915368081 │        11000 │
│ q              │         3849 │   3849069354 │        46573 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence from a resolved promise
Performance of large sequence of then calls from a resolved promise

If a library supports a lighter weight notion of a promise, that
will be used instead of a full deferred (which is typically more
expensive)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           34 │      3415663 │            - │
│ when           │           45 │      4485589 │           31 │
│ deferred       │          135 │     13489583 │          295 │
│ avow           │          283 │     28294625 │          728 │
│ micro-promise  │          915 │     91465744 │         2578 │
│ rsvp           │         1292 │    129156413 │         3681 │
│ promises-a     │         1783 │    178273667 │         5119 │
│ jquery         │         2125 │    212478923 │         6121 │
│ q              │        23707 │   2370683524 │        69306 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> fulfill (10,000 iterations)
Transition a pending promise to a fulfilled state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           70 │         6957 │            - │
│ when           │           87 │         8653 │           24 │
│ avow           │           90 │         8965 │           29 │
│ jquery         │          165 │        16459 │          137 │
│ micro-promise  │          165 │        16473 │          137 │
│ rsvp           │          177 │        17748 │          155 │
│ deferred       │          224 │        22407 │          222 │
│ q              │         1493 │       149270 │         2046 │
│ promises-a     │        11041 │      1104097 │        15771 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> fulfill sequence (10 iterations)
Transition a large sequence of pending promises to a fulfilled state.
Data will be propagated down the sequence
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ micro-promise  │            8 │       812055 │            - │
│ laissez-faire  │            8 │       840204 │            3 │
│ when           │           14 │      1358373 │           67 │
│ avow           │           18 │      1803832 │          122 │
│ jquery         │           49 │      4876505 │          501 │
│ rsvp           │           54 │      5354698 │          559 │
│ deferred       │           78 │      7767362 │          857 │
│ q              │          265 │     26531122 │         3167 │
│ promises-a     │          296 │     29618639 │         3547 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> reject (10,000 iterations)
Transition a pending promise to rejected state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ avow           │          275 │        27461 │            - │
│ micro-promise  │          281 │        28058 │            2 │
│ laissez-faire  │          288 │        28811 │            5 │
│ when           │          297 │        29679 │            8 │
│ rsvp           │          336 │        33625 │           22 │
│ jquery         │          425 │        42546 │           55 │
│ deferred       │          626 │        62647 │          128 │
│ promises-a     │        12098 │      1209847 │         4306 │
│ q              │        12605 │      1260540 │         4490 │
└────────────────┴──────────────┴──────────────┴──────────────┘
```

