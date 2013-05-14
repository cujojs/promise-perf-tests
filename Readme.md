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
│   ├─┬ form-data@0.0.6
│   │ ├── async@0.1.22
│   │ └─┬ combined-stream@0.0.3
│   │   └── delayed-stream@0.0.5
│   └── mime@1.2.9
├── laissez-faire@0.10.1
├── micro-promise@0.1.0
├── promises-a@2.3.0
├─┬ promisify@0.1.0
│ ├── laissez-faire@0.10.1
│ └── sliced@0.0.3
├── q@0.8.12
├── randy@1.4.0
├── rsvp@1.2.0
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
│ laissez-faire  │            2 │          191 │            - │
│ when           │            8 │          806 │          322 │
│ promises-a     │           10 │         1030 │          440 │
│ deferred       │           19 │         1888 │          888 │
│ avow           │           27 │         2681 │         1304 │
│ micro-promise  │           89 │         8876 │         4547 │
│ rsvp           │          151 │        15123 │         7818 │
│ q              │          211 │        21070 │        10932 │
│ jquery         │          298 │        29770 │        15486 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a pending promise (10,000 iterations)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            2 │          161 │            - │
│ avow           │            6 │          625 │          287 │
│ promises-a     │            7 │          669 │          314 │
│ when           │            7 │          702 │          335 │
│ deferred       │           39 │         3888 │         2310 │
│ rsvp           │           58 │         5819 │         3507 │
│ micro-promise  │           76 │         7624 │         4626 │
│ jquery         │          280 │        27956 │        17228 │
│ q              │         2941 │       294101 │       182198 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a rejected promise (10,000 iterations)
Some libraries provide an optimised way of doing this

This test DOES NOT care about when all the promises
have actually resolved (e.g. Q promises always resolve in a
future turn).  This is a pure, brute force sync code test.
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            2 │          188 │            - │
│ when           │            8 │          755 │          301 │
│ promises-a     │            8 │          759 │          304 │
│ deferred       │            8 │          775 │          312 │
│ avow           │           28 │         2763 │         1370 │
│ micro-promise  │           78 │         7767 │         4031 │
│ rsvp           │          154 │        15443 │         8115 │
│ q              │          277 │        27691 │        14630 │
│ jquery         │          300 │        29981 │        15847 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence from a pending promise
Performance of large sequence of then calls from a pending promise
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            7 │      7069088 │            - │
│ avow           │           10 │     10254571 │           45 │
│ promises-a     │           10 │     10323056 │           46 │
│ when           │           12 │     11818193 │           67 │
│ deferred       │           57 │     56552970 │          700 │
│ rsvp           │          132 │    132232586 │         1771 │
│ micro-promise  │          220 │    220274261 │         3016 │
│ jquery         │          834 │    833552425 │        11692 │
│ q              │         3593 │   3592781591 │        50724 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence from a resolved promise
Performance of large sequence of then calls from a resolved promise

If a library supports a lighter weight notion of a promise, that
will be used instead of a full deferred (which is typically more
expensive)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           47 │      4679037 │            - │
│ when           │           51 │      5100774 │            9 │
│ deferred       │          143 │     14309393 │          206 │
│ avow           │          215 │     21469056 │          359 │
│ micro-promise  │          707 │     70740512 │         1412 │
│ rsvp           │         1314 │    131416526 │         2709 │
│ promises-a     │         1872 │    187223170 │         3901 │
│ jquery         │         2445 │    244466789 │         5125 │
│ q              │        17926 │   1792614754 │        38212 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> fulfill (10,000 iterations)
Transition a pending promise to a fulfilled state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           65 │         6508 │            - │
│ micro-promise  │           72 │         7185 │           10 │
│ avow           │           80 │         8031 │           23 │
│ when           │           81 │         8121 │           25 │
│ rsvp           │          163 │        16272 │          150 │
│ jquery         │          230 │        23003 │          253 │
│ deferred       │          242 │        24167 │          271 │
│ q              │         1299 │       129926 │         1897 │
│ promises-a     │        11132 │      1113250 │        17007 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> fulfill sequence (10 iterations)
Transition a large sequence of pending promises to a fulfilled state.
Data will be propagated down the sequence
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            6 │       614888 │            - │
│ micro-promise  │           11 │      1122175 │           83 │
│ when           │           15 │      1468349 │          139 │
│ avow           │           18 │      1815818 │          195 │
│ rsvp           │           52 │      5225995 │          750 │
│ jquery         │           60 │      6016816 │          879 │
│ deferred       │           68 │      6823214 │         1010 │
│ promises-a     │          278 │     27830037 │         4426 │
│ q              │          300 │     29990541 │         4777 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> reject (10,000 iterations)
Transition a pending promise to rejected state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ micro-promise  │           68 │         6767 │            - │
│ laissez-faire  │           75 │         7545 │           11 │
│ when           │           91 │         9072 │           34 │
│ avow           │          103 │        10324 │           53 │
│ rsvp           │          144 │        14393 │          113 │
│ deferred       │          192 │        19226 │          184 │
│ jquery         │          218 │        21776 │          222 │
│ q              │         2839 │       283937 │         4096 │
│ promises-a     │        11091 │      1109114 │        16291 │
└────────────────┴──────────────┴──────────────┴──────────────┘
```

