#!/usr/bin/env node

var program = require('commander')
  , fork = require('child_process').fork
  , resolvePath = require('path').resolve
  , readDir = require('fs').readdirSync
  , baseDir = require('path').resolve(__dirname, '..')

require('colors')

var tests = readDir(baseDir+'/lib/tests').map(function (n) {return n.replace(/\.js$/, '')})
var adapters = readDir(baseDir+'/lib/adapters').map(function (n) {return n.replace(/\.js$/, '')})

program.version(require('../package.json').version)
	.usage('[options]\n\n' 
	      + '  Tests: '+tests.join(', ') + ', or all\n'
	      + '  Adapters: '+adapters.join(', ')
	   )
	.option('-a, --adapter [path]', 'The adapter you want to run', false)
	.option('-t, --test [name]', 'The name of the test you want to run', 'all')
	.parse(process.argv)

var childArgs = []
if (program.adapter) childArgs.push(program.adapter)

if (program.test === 'all') {
	fork(resolvePath(__dirname, '../lib/run-all.js'), childArgs)
} else {
	childArgs.unshift(program.test)
	fork(resolvePath(__dirname, '../lib/run.js'), childArgs)
}
