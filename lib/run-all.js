var readDir = require('fs').readdirSync
  , read = require('fs').readFileSync
  , Promise = require('laissez-faire')
  , promisify = require('promisify').node
  , exec = promisify(require('exec'))

/**
 * A list of tests
 */
readDir(__dirname+'/tests')
.filter(function (name) {return name[0] !== '.'})
.sort(function (a, b) {
	return read(__dirname+'/tests/'+a, 'utf-8') > read(__dirname+'/tests/'+b, 'utf-8')
})
// Run sequencial
.reduce(function (promise, test) {
	return promise.then(function () {
		return exec([
			'node',
			__dirname+'/run.js', 
			test, 
			process.argv[2] || ''
		]).then(
			function (results) {
				process.stdout.write(results.toString())
			},
			function (error) {
				process.stderr.write(error.toString())
				process.exit(1)
			}
		)
	})
}, Promise.fulfilled()).then(function () {
	process.exit(0)
}).throw()