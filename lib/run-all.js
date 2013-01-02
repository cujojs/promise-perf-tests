var fork = require('child_process').fork
  , readDir = require('fs').readdirSync
  , Promise = require('laissez-faire')

/**
 * A list of tests
 */
readDir(__dirname+'/tests').reduce(function (promise, test) {
	return promise.then(function () {
		// var p = new Promise
		var child = fork(
			__dirname+'/run', 
			[test],
			{silent:true}
		)
		child.stdout.on('data', function (d) {
			d = d.toString()
			// if (d.match(/^done/)) p.resolve()
			// else 
			process.stdout.write(d)
			// p.resolve()
		})
		child.on('exit', function () {
			console.log('good')
		})
		child.on('close', function () {
			console.log('ok')
		})
		// return p
	})
}, Promise.fulfilled())//.then(function () {process.exit()}).throw()