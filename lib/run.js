var readDir = require('fs').readdirSync
  , readFile = require('fs').readFileSync
  , Promise = require('laissez-faire')
  , present = require('./presenter')
  , promisify = require('promisify').node
  , exec = promisify(require('exec'))
  , shuffle = require('randy').shuffle
  , resolvePath = require('path').resolve

require('colors')

/**
 * Determine which implementaions to run
 */
if (process.argv[3]) {
	var imps = [process.argv[3]+'.js']
} else {
	var imps = readDir(__dirname+'/adapters').filter(function (f) {
		return f[0] !== '.'
	})
}

/**
 * Determine which test to run
 */
var test = process.argv[2]
if (!test) throw new Error('Needs an arg')
if (!test.match(/\.js$/)) test += '.js'
var path = __dirname+'/tests/'+test

/**
 * Running tests sequentially to ensure resource availability is consistant between libraries
 * This makes a big difference as running tests in parrallel was horribly inconsistant
 */
shuffle(imps).reduce(function (indexP, file) {
	return indexP.then(function (results) {
		return exec([
			'node', 
			path,
			// Allows absolute paths to adapters
			resolvePath(__dirname+'/adapters/', file)
		]).then(
			function (data) {
				return results.concat(JSON.parse(data.toString()))
			},
			function (error) {
				process.stderr.write(('While processing '+file).red.bold)
				process.stderr.write(error)
				process.exit(1)
			}
		)
	})
}, Promise.fulfilled([])).end(function (results) {
	describe()
	present(results)
	process.exit(0)
}, function (err) {
	err.message+=' (While parsing json)'
	process.stderr.write(err.toString())
})

/**
 * Display info about the test
 */
function describe () {
	var file = readFile(path, 'utf-8').split('\n')
	var startWithComment = /^\/\/[^\w]*/
	var name = file[0].replace(startWithComment, '')
	process.stdout.write(name.bold.green.underline+'\n')

	var i = 0
	while (file[++i].match(startWithComment)) {
		var description = file[i].replace(startWithComment, '')
		process.stdout.write(description.grey+'\n')
	}
}