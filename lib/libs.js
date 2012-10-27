// This turns off Object.freeze() in when.js
// The other libs (except Q) *do not* use Object.freeze(),
// and there is currently a bug (imho) in v8 that causes
// large performance degredations on frozen objects:

// http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects

// So, this levels the test playing field for all libs
// except Q, which as far as I can tell, has no way of
// disabling its calls to Object.freeze()

process.env.WHEN_PARANOID = false;

// Load all promise impls
module.exports = {
	when: require('./adapters/when'),
	q: require('./adapters/q'),
	deferred: require('./adapters/deferred'),
	jquery: require('./adapters/jquery'),
	rsvp: require('./adapters/rsvp')
};
