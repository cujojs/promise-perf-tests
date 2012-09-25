# Promise implementation performance tests

This is a set of *basic* performance tests for promise implementations.  As is usually the case, take these with the usual grains salt.  That said, they should give a reasonable ballpark comparison of the performance characteristics of common, basic operations that most promise libraries provide.

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