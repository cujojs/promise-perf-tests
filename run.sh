#!/usr/bin/env bash

function runTest {
	echo "---------------------------"
	echo "Test: $1"
	echo "---------------------------"
	node $1
}

# This turns off Object.freeze() in when.js
# The other libs (except Q) *do not* use Object.freeze(),
# and there is currently a bug (imho) in v8 that causes
# large performance degredations on frozen objects:
# 
# http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects
# 
# So, this levels the test playing field for all libs
# except Q, which as far as I can tell, has no way of
# disabling its calls to Object.freeze()
export WHEN_PARANOID=false

# Promise basics
runTest promise-create.js
runTest promise-reject.js
runTest promise-sequence.js

# Deferred basics
runTest defer-create.js
runTest defer-resolve.js
runTest defer-reject.js
runTest defer-sequence.js

# Higher order operations, if supported
runTest map.js
runTest reduce.js

