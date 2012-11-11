var tests = [
	// Promise basics
	'promise-fulfill',
	'promise-reject',
	'promise-sequence',

	// Deferred basics
	'defer-create',
	'defer-fulfill',
	'defer-reject',
	'defer-sequence',

	// Higher order operations, if supported
	'map',
	'reduce-small',
	'reduce-large'
].map(function (path) {
	return './tests/'+path+'.js'
})
.forEach(require)
