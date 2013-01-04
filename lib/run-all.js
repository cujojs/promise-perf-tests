var fork = require('child_process').fork
  , readDir = require('fs').readdirSync
  , read = require('fs').readFileSync
  , Promise = require('laissez-faire')

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
		var p = new Promise
		var child = fork(
			__dirname+'/run', 
			[
				test, 
				process.argv[2] ? process.argv[2] : ''
			],
			{silent:true}
		)
		child.stdout.on('data', function (d) {
			d = d.toString()
			process.stdout.write(d)
			// If its the table then we are done
			if (d.match(/┼/)) p.resolve()
		})
		return p
	})
}, Promise.fulfilled()).then(function () {
	process.exit(0)
}).throw()