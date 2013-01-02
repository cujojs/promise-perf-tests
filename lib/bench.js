var Bench = require('b')

/**
 * Run a bench
 *
 * @param {String} library
 * @param {Number} iterations 
 * @param {Function} fn test script
 */
module.exports = function (library, iterations, fn) {
	var bench = Bench(library).reporter({
		report: function (name, result, iterations) {
			process.stdout.write(JSON.stringify({
				library: name,
				time: result,
				iterations: iterations
			}))
		}
	})
	bench.on('done', function () {process.exit()})
	bench.run(iterations, fn)
}
