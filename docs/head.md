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