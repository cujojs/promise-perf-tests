var fork = require('child_process').fork
  , readDir = require('fs').readdirSync
  , Promise = require('laissez-faire')

/**
 * A list of tests
 */
readDir(__dirname+'/tests')
.filter(function (name) {return name[0] !== '.'})
.sort()
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
			if (d.match(/average \(ns\)/)) p.resolve()
		})
		return p
	})
}, Promise.fulfilled()).then(function () {
	process.exit(0)
}).throw()