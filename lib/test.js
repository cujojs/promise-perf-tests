module.exports = Test;

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
		var result, total;

		result = new Result(libName, this.iterations, elapsed, computed);
		total = this.byLib[libName];

		this.byLib[libName] = total ? total.add(result) : result;
		this.results.push(result);
	},

	addError: function(libName, error) {
		this.errors.push({ name: libName, error: error });
	},

	getSortedResults: function() {
		var byLib = this.byLib;
		return Object.keys(this.byLib).map(function(lib) {
			return byLib[lib];
		}).sort(sortByTotal);
	},

	run: function(testCases, exitWhenDone) {
		if(testCases.length === 0) {
			return;
		}

		var promise;

		for(var i=0; i<10; i++) {
			promise = promise ? promise.then(testRun) : testRun();
		}

		promise.then(this.report.bind(this));

		// some libs (e.g. deferred) seem to cause the process to hang
		// when they have leftover unresolved promises, so we have to
		// force the process to exit.
		if(exitWhenDone) {
			promise.then(exit, exit);
		}

		function testRun() {
			var cases = shuffle(testCases);
			return cases.slice(1).reduce(function(p, task) {
				return p.then(task);
			}, cases[0]());
		}

		function exit() {
			process.exit(0);
		}
	},

	report: function() {
		console.log('');
		console.log('==========================================================');
		console.log('Test:', this.name, 'x', this.iterations);

		if(this.description) {
			console.log(this.description);
		}

		console.log('----------------------------------------------------------');
		console.log(columns([
			'Name',
			'Time ms',
			'Avg ms',
			'Diff %'
		], 8));
		var results = this.getSortedResults();

		results.forEach(function(r) {
			var diff = difference(results[0].total, r.total);
			console.log(columns([
				r.name,
				formatNumber(r.total, 0),
				formatNumber(r.avg(), 4),
				formatNumber(diff, 2)
			], 8));
		});

		if(this.errors.length) {
			this.errors.forEach(function(e) {
				console.log(e.name, e.error);
			});
		}

	}
};

// Standard Fisher-Yates shuffle
function shuffle(arr) {
	var shuffled, i, j, len;

	shuffled = [];
	len = arr.length;

	if(len) {
		i = 1;

		shuffled.push(arr[0]);

		for(;i < len; i++) {
			j = Math.floor(Math.random() * i);
			shuffled[i] = shuffled[j];
			shuffled[j] = arr[i];
		}
	}

	return shuffled;
}

function sortByTotal(r1, r2) {
	return r1.total - r2.total;
}

function formatNumber(x, n) {
	return x === 0 ? '-' : Number(x).toFixed(n);
}

function Result(name, iterations, time, value) {
	this.name = name;
	this.total = time;
	this.iterations = iterations;
	this.value = value;
}

Result.prototype = {
	add: function (result) {
		return new Result(this.name,
			this.iterations + result.iterations,
			this.total + result.total,
			this.result
		);
	},

	avg: function () {
		return this.total / this.iterations;
	}
};

function difference(r1, r2) {
	return ((r2-r1) / r1) * 100;
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
