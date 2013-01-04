#!/usr/bin/env node

var fork = require('child_process').fork
  , readDir = require('fs').readdirSync
  , readFile = require('fs').readFileSync
  , Promise = require('laissez-faire')
  , present = require('./presenter')
  , shuffle = require('randy').shuffle

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
	var args = []
	// Allow absolute paths to adapters
	if (file[0]==='/') {
		args.push(file)
	} else {
		args.push(__dirname+'/adapters/'+file)
	}
	return indexP.then(function (results) {
		var promise = new Promise
		var child = fork(
			path, 
			args, 
			{silent: true}
		)
		child.stdout.on('data', function (data) {
			try {
				results = results.concat(JSON.parse(data.toString()))
				promise.resolve(results)
			} catch (e) {
				process.stdout.write('error: '+data.toString())
			}
		})
		child.stderr.on('data', function (d) {
			process.stdout.write(d.toString()+'\n')
		})
		return promise
	})
}, Promise.fulfilled([])).then(function (results) {
	describe()
	present(results)
	process.exit(0)
}).throw()

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
