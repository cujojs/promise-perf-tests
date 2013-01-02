module.exports = Test

function Test(testName, iterations, description) {
	this.name = testName;
	this.iterations = iterations;
	this.description = description;
	this.results = [];
	this.errors = [];
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

	run: function(iterations, script) {
		require('../bench')
	},

};

function Result(name, iterations, time, value) {
	this.name = name;
	this.total = time;
	this.avg = time/iterations;
	this.value = value;
}
