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