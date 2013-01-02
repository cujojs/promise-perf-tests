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
State transition -> fulfill (10,000 iterations)
Transition a pending promise to a fulfilled state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ q              │           36 │         3641 │            - │
│ avow           │           62 │         6181 │           70 │
│ when           │           74 │         7352 │          102 │
│ laissez-faire  │           80 │         7973 │          119 │
│ rsvp           │           87 │         8655 │          138 │
│ jquery         │          113 │        11340 │          211 │
│ deferred       │          149 │        14909 │          309 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a fulfilled promise (10,000 iterations)
Create a promise thats already fulfilled.
Some libraries provide an optimised way of doing this

This test DOES NOT care about when all the promises
have actually resolved (e.g. Q promises always resolve in a
future turn).  This is a pure, brute force sync code test.
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │            7 │          742 │            - │
│ laissez-faire  │            9 │          859 │           16 │
│ deferred       │           21 │         2123 │          186 │
│ avow           │           30 │         3047 │          311 │
│ rsvp           │          161 │        16097 │         2070 │
│ q              │          323 │        32276 │         4252 │
│ jquery         │          446 │        44597 │         5913 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Instantiation (10,000 iterations)
Create a pending instance
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            2 │          172 │            - │
│ avow           │            6 │          581 │          237 │
│ when           │            7 │          740 │          330 │
│ deferred       │           44 │         4436 │         2474 │
│ rsvp           │           56 │         5648 │         3177 │
│ q              │          229 │        22950 │        13217 │
│ jquery         │          472 │        47234 │        27308 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Pending sequence
How long does it take to create chain of un-resolved promises

Performance of the synchronous component of creating deferreds. 
For most libraries the synchronous component is all there is but 
some may not. This test doesn't take those libraries into account
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │           10 │      9552571 │            - │
│ avow           │           11 │     10870630 │           14 │
│ when           │           13 │     12893515 │           35 │
│ deferred       │           94 │     93684568 │          881 │
│ rsvp           │          101 │    100523888 │          952 │
│ q              │          408 │    407971716 │         4171 │
│ jquery         │          782 │    782353715 │         8090 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a promise chain of an already resolved promise
Performance of large sequence of then calls on a resolved promise

If a library supports a lighter weight notion of a promise, that
will be used instead of a full deferred (which is typically more
expensive)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │           43 │      4261614 │            - │
│ laissez-faire  │          115 │     11535532 │          171 │
│ deferred       │          126 │     12645855 │          197 │
│ rsvp           │          430 │     42979469 │          909 │
│ jquery         │          465 │     46507427 │          991 │
│ avow           │          601 │     60148598 │         1311 │
│ q              │          705 │     70546844 │         1555 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> reject (10,000 iterations)
Transition a pending promise to rejected state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │          177 │        17728 │            - │
│ avow           │          199 │        19857 │           12 │
│ rsvp           │          232 │        23163 │           31 │
│ laissez-faire  │          262 │        26204 │           48 │
│ deferred       │          282 │        28163 │           59 │
│ jquery         │          395 │        39507 │          123 │
│ q              │          537 │        53659 │          203 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a rejected promise (10,000 iterations)
Create a promise thats already rejected.
Some libraries provide an optimised way of doing this

This test DOES NOT care about when all the promises
have actually resolved (e.g. Q promises always resolve in a
future turn).  This is a pure, brute force sync code test.
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ deferred       │          145 │        14522 │            - │
│ laissez-faire  │          199 │        19920 │           37 │
│ avow           │          209 │        20926 │           44 │
│ when           │          254 │        25395 │           75 │
│ rsvp           │          480 │        47968 │          230 │
│ q              │          483 │        48341 │          233 │
│ jquery         │          614 │        61399 │          323 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence resolve
Transition a large sequence of pending promises to a fulfilled state.
Data will be propagated down the sequence
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ avow           │           11 │      1136397 │            - │
│ when           │           14 │      1432241 │           26 │
│ laissez-faire  │           16 │      1592183 │           40 │
│ jquery         │           36 │      3601497 │          217 │
│ deferred       │           38 │      3762173 │          231 │
│ rsvp           │           44 │      4436490 │          290 │
│ q              │          235 │     23466166 │         1965 │
└────────────────┴──────────────┴──────────────┴──────────────┘
```