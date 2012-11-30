module.exports = Test;
var Promise = require('laissez-faire')

// TODO: Abstract test reporting and create CSV reporter

function Test(testName, iterations, description) {
	this.name = testName;
	this.iterations = iterations;
	this.description = description;
	this.results = [];
	this.errors = [];
	this.byLib = {};
}

Test.prototype = {
	addResult: function(libName, elapsed, computed) {
		var result = new Result(libName, this.iterations, elapsed, computed);

		this.byLib[libName] = result;
		this.results.push(result);
	},

	addError: function(libName, error) {
		this.errors.push({ name: libName, error: error });
	},

	getSortedResults: function() {
		return this.results.slice().sort(sortByTotal);
	},

	run: function(testCases, exitWhenDone) {
		var self = this
		if(testCases.length === 0) {
			return;
		}
		testCases.reduce(function(p, task) {
			return p.then(function(){
				var p = new Promise
				// Nexttick used to clear call stack in between runs
				process.nextTick(function () {
					task().then(function () {p.resolve()})
				})
				return p
			})
		}, Promise.fulfilled()).then(function(){
			// some libs (e.g. deferred) seem to cause the process to hang
			// when they have leftover unresolved promises, so we have to
			// force the process to exit.
			self.report(exitWhenDone)
		});
	},

	report: function(exit) {
		// console.log('');
		console.log('====================================================');
		console.log('Test:', this.name, 'x', this.iterations);

		if(this.description) {
			console.log(this.description);
		}

		console.log('----------------------------------------------------');
		console.log(columns([
			'Name',
			'Time ms',
			'ns/run',
			'Diff %'
		], 12));
		var results = this.getSortedResults();

		results.forEach(function(r) {
			var diff = difference(results[0].total, r.total);
			var txt = columns([
				r.name.slice(0,8),
				formatNumber(r.total / 1000000, 0),
				formatNumber(r.avg, 0),
				formatNumber(diff, 0)
			], 12)
			console.log(txt);
		});

		if(this.errors.length) {
			this.errors.forEach(function(e) {
				console.log(e.name, e.error);
			});
		}
		// console.log is done async so this allows exiting only after logging
		// The exit option is used on tests which otherwise won't exit cleanly
		exit === true && process.nextTick(process.exit)
	}
};

function sortByTotal(r1, r2) {
	return r1.total - r2.total;
}

function formatNumber(x, n) {
	return x === 0 ? '-' : Number(x).toFixed(n);
}

function Result(name, iterations, time, value) {
	this.name = name;
	this.total = time;
	this.avg = time/iterations;
	this.value = value;
}

function difference(r1, r2) {
	// r1 can't be 0
	return ((r2-r1) / (r1 || 1)) * 100;
}

function columns(cols, size) {
	var align = leftAlign;
	return cols.map(function(val) {
		var s = align(String(val), size);

		align = rightAlign;

		return s;
	}).join('');
}

function leftAlign(s, size) {
	while(s.length < size) {
		s = s + ' ';
	}

	return s;
}

function rightAlign(s, size) {
	while(s.length < size) {
		s = ' ' + s;
	}

	return ' ' + s;
}
