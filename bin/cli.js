#!/usr/bin/env node

var program = require('commander')
  , fork = require('child_process').fork
  , resolvePath = require('path').resolve

require('colors')

program.version(require('../package.json').version)
	.usage('[options]')
	.option('-a, --adapter [path]', 'The adapter you want to run', false)
	.option('-t, --test [name]', 'The name of the test you want to run', 'all')
	.parse(process.argv)

var childArgs = []

if (program.test === 'all') {
	fork(resolvePath(__dirname, '../lib/run-all.js'), program.adapter ? [program.adapter] : [])
} else {
	fork(resolvePath(__dirname, '../lib/run.js'), [program.test])
}
