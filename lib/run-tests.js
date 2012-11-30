var spawn = require('child_process').spawn,
    Promise = require('laissez-faire'),
    path = require('path')

// This is the first node in a chain of promises that form the test suite
var tests = Promise.fulfilled('Tests starting');
[
    // Promise basics
    'promise-fulfill',
    'promise-reject',
    'promise-sequence',

    // Deferred basics
    'defer-create',
    'defer-fulfill',
    'defer-reject',
    'defer-seq-create',
    'defer-seq-resolve',
    'defer-seq-both',

    // Higher order operations, if supported
    'map',
    'reduce-large',
    'reduce-small'
]
.map(function (test) {
    return path.join(__dirname, 'tests', test+'.js')
})
.reduce(function (promise, path) {
    return promise.then(function () {
        return run(path).then(console.log.bind(console), console.log.bind(console, 'error'))
    })
}, tests)
.then(function(){process.exit()})

function run (path) {
    var p = new Promise
    var child = spawn('node', [path])
    var res = ''

    child.stdout.on('data', function (data) {
        res += data.toString()
    });

    child.stderr.on('data', function (data) {
        p.reject(new Error(data.toString()))
    });

    child.on('exit', function (code) {
        p.resolve(res)
    });

    return p
}