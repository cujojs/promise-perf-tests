#!/usr/bin/env bash

# Simple test runner and separator
function runTest {
	node lib/tests/$1
}

# Promise basics
runTest promise-fulfill.js
runTest promise-reject.js
runTest promise-sequence.js

# Deferred basics
runTest defer-create.js
runTest defer-fulfill.js
runTest defer-reject.js
runTest defer-sequence.js

# Higher order operations, if supported
runTest map.js
runTest reduce-small.js
runTest reduce-large.js

