// Load all promise impls
module.exports = {
	when: require('./adapters/when'),
	avow: require('./adapters/avow'),
	q: require('./adapters/q'),
	deferred: require('./adapters/deferred'),
	jquery: require('./adapters/jquery'),
	rsvp: require('./adapters/rsvp'),
	laissez: require('./adapters/laissez-faire')
};
