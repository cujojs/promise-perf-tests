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
├─┬ b@1.0.0 -> /home/jkroso/Dev/node/b
│ ├── chai@1.4.2
│ └─┬ mocha@1.7.4
│   ├── commander@0.6.1
│   ├── debug@0.7.0
│   ├── diff@1.0.2
│   ├── growl@1.6.1
│   ├─┬ jade@0.26.3
│   │ └── mkdirp@0.3.0
│   ├── mkdirp@0.3.3
│   └── ms@0.3.0
├─┬ cli-table@0.2.0
│ └── colors@0.3.0
├── colors@0.6.0-1
├─┬ commander@1.1.1
│ └── keypress@0.1.0
├─┬ deferred@0.6.1
│ ├── es5-ext@0.9.1
│ ├── event-emitter@0.2.1
│ └── next-tick@0.1.0
├── jquery-browserify@1.8.1
├─┬ jsdom@0.3.4
│ ├─┬ contextify@0.1.3
│ │ └── bindings@1.0.0
│ ├── cssom@0.2.5
│ ├── cssstyle@0.2.3
│ ├── htmlparser@1.7.6
│ ├── nwmatcher@1.3.0
│ └─┬ request@2.12.0
│   ├─┬ form-data@0.0.3
│   │ ├── async@0.1.9
│   │ └─┬ combined-stream@0.0.3
│   │   └── delayed-stream@0.0.5
│   └── mime@1.2.7
├── laissez-faire@0.7.2
├── q@0.8.12
├── rsvp@1.1.0
└── when@1.7.1
```

# Test Results

Each test is sorted from best to worst time. Times are in milliseconds, and Diff is the percentage difference from the best time.

```
State transition -> fulfill (10,000 iterations)
Transition a pending promise to a fulfilled state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ avow           │           54 │         5371 │            - │
│ when           │           74 │         7367 │           37 │
│ laissez-faire  │           77 │         7707 │           43 │
│ rsvp           │           87 │         8713 │           62 │
│ jquery         │           90 │         8952 │           67 │
│ deferred       │          160 │        15964 │          197 │
│ q              │          928 │        92764 │         1627 │
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
│ when           │            7 │          738 │            - │
│ laissez-faire  │            8 │          817 │           11 │
│ deferred       │           21 │         2146 │          191 │
│ avow           │           30 │         3022 │          310 │
│ rsvp           │          165 │        16454 │         2130 │
│ q              │          247 │        24674 │         3244 │
│ jquery         │          341 │        34110 │         4523 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Instantiation (10,000 iterations)
Create a pending instance
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            2 │          179 │            - │
│ avow           │            6 │          593 │          231 │
│ when           │            7 │          741 │          313 │
│ deferred       │           44 │         4433 │         2372 │
│ rsvp           │           56 │         5571 │         3006 │
│ jquery         │          325 │        32476 │        18007 │
│ q              │         3270 │       326989 │       182217 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Pending sequence
How long does it take to create chain of un-resolved promises
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ laissez-faire  │            9 │      9186189 │            - │
│ avow           │           11 │     10610068 │           16 │
│ when           │           13 │     13175288 │           43 │
│ rsvp           │           74 │     74021877 │          706 │
│ deferred       │           81 │     81114032 │          783 │
│ jquery         │          747 │    747146457 │         8033 │
│ q              │         3779 │   3779401289 │        41042 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Create a promise chain of an already resolved promise
Performance of large sequence of then calls on a resolved promise

If a library supports a lighter weight notion of a promise, that
will be used instead of a full deferred (which is typically more
expensive)
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ when           │           42 │      4203172 │            - │
│ laissez-faire  │           80 │      7972499 │           90 │
│ deferred       │          129 │     12891764 │          207 │
│ avow           │          427 │     42726316 │          917 │
│ rsvp           │         1318 │    131759730 │         3035 │
│ jquery         │         2263 │    226335546 │         5285 │
│ q              │        21576 │   2157575094 │        51232 │
└────────────────┴──────────────┴──────────────┴──────────────┘
State transition -> reject (10,000 iterations)
Transition a pending promise to rejected state
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ avow           │          175 │        17539 │            - │
│ when           │          179 │        17891 │            2 │
│ laissez-faire  │          207 │        20708 │           18 │
│ deferred       │          230 │        23047 │           31 │
│ rsvp           │          265 │        26501 │           51 │
│ jquery         │          318 │        31767 │           81 │
│ q              │          578 │        57848 │          230 │
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
│ laissez-faire  │          136 │        13628 │            - │
│ deferred       │          143 │        14254 │            5 │
│ when           │          187 │        18702 │           37 │
│ avow           │          211 │        21129 │           55 │
│ rsvp           │          403 │        40258 │          195 │
│ q              │          474 │        47444 │          248 │
│ jquery         │          682 │        68248 │          401 │
└────────────────┴──────────────┴──────────────┴──────────────┘
Sequence resolve
Transition a large sequence of pending promises to a fulfilled state.
Data will be propagated down the sequence
┌────────────────┬──────────────┬──────────────┬──────────────┐
│                │   total (ms) │ average (ns) │     diff (%) │
├────────────────┼──────────────┼──────────────┼──────────────┤
│ avow           │           11 │      1137605 │            - │
│ laissez-faire  │           14 │      1403567 │           23 │
│ when           │           14 │      1449867 │           27 │
│ jquery         │           36 │      3611722 │          217 │
│ deferred       │           45 │      4538832 │          299 │
│ rsvp           │           51 │      5137514 │          352 │
│ q              │          229 │     22886267 │         1912 │
└────────────────┴──────────────┴──────────────┴──────────────┘
```