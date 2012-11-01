// Load all promise impls
module.exports = {
	when: require('./adapters/when'),
	q: require('./adapters/q'),
	deferred: require('./adapters/deferred'),
	jquery: require('./adapters/jquery'),
	rsvp: require('./adapters/rsvp')
};
