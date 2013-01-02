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
var results = imps.map(function (file) {
	var promise = new Promise
	var child = fork(
		path, 
		[__dirname+'/adapters/'+file], 
		{silent: true}
	)
	child.stdout.on('data', function (data) {
		try {
			promise.resolve(JSON.parse(data.toString()))
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
all(results).then(function (results) {
	describe(readFile(path, 'utf-8'))
	present(results)
	// console.log('done')
})

function describe (file) {
	file = file.split('\n')
	var name = file[0].replace(/^[^\w]*/, '')
	var description = file[1].replace(/^[^\w]*/, '')
	process.stdout.write(name.bold.green.underline+'\n')
	if (description) process.stdout.write(description.grey+'\n')
}
