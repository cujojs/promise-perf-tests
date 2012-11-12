// Load all promise impls
module.exports = {
	when: require('./adapters/when'),
	q: require('./adapters/q'),
	laissez: require('./adapters/laissez-faire'),
	deferred: require('./adapters/deferred'),
<<<<<<< HEAD
	jquery: require('./adapters/jquery'),
	rsvp: require('./adapters/rsvp'),
	laissez: require('./adapters/laissez-faire')
=======
	// jquery is throwing an error
	// jquery: require('./adapters/jquery'),
	rsvp: require('./adapters/rsvp')
>>>>>>> origin/master
};
