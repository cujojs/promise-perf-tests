var fork = require('child_process').fork
  , readDir = require('fs').readdirSync
  , readFile = require('fs').readFileSync
  , Promise = require('laissez-faire')
  , all = require('when').all
  , present = require('./presenter')

require('colors')

/**
 * A list of adapters
 */
var imps = readDir(__dirname+'/adapters')

var test = process.argv[2]
if (!test) throw new Error('Needs an arg')
if (!test.match(/\.js$/)) test += '.js'

var path = __dirname+'/tests/'+test

/**
 * Running tests in sequence to ensure resource availability is consistant between libraries
 * This makes a big difference as running tests in parrallel was horribly inconsistant
 */
imps.reduce(function (indexP, file) {
	return indexP.then(function (results) {
		var promise = new Promise
		var child = fork(
			path, 
			[__dirname+'/adapters/'+file], 
			{silent: true}
		)
		child.stdout.on('data', function (data) {
			try {
				results = results.concat(JSON.parse(data.toString()))
				promise.resolve(results)
			} catch (e) {
				process.stdout.write('error: '+data.toString())
				// throw new Error('invalid json')
			}
		})
		child.stderr.on('data', function (d) {
			process.stdout.write(d.toString()+'\n')
		})
		return promise
	})
}, Promise.fulfilled([])).then(function (results) {
	describe(readFile(path, 'utf-8'))
	present(results)
})

function describe (file) {
	file = file.split('\n')
	var startWithComment = /^\/\/[^\w]*/
	var name = file[0].replace(startWithComment, '')
	process.stdout.write(name.bold.green.underline+'\n')

	var i = 0
	while (file[++i].match(startWithComment)) {
		var description = file[i].replace(startWithComment, '')
		process.stdout.write(description.grey+'\n')
	}
}
