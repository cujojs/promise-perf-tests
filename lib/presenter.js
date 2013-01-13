var Table = require('cli-table')

module.exports = function (results) {
	var table = new Table({
		head:			['',		'total (ms)', 'per run (ns)',	'diff (%)'],
		colWidths:	[16,		14,		14,			14],
		colAligns:	['left', 'right', 'right',		'right'],
		style: {
			'padding-left': 1,
			'padding-right': 1,
			head: ['cyan'],
			compact : true
		}
	})
	results = results.sort(function (a,b) {
		return a.time - b.time
	})
	results.forEach(function(r) {
		var entry = {}
		entry[r.library] = [
			formatNumber(r.time / 1000000, 0),
			formatNumber(r.time / r.iterations, 0),
			formatNumber(difference(results[0].time, r.time), 0)
		]
		table.push(entry)
	})
	console.log(table.toString())
}

function difference(r1, r2) {
	// r1 can't be 0
	return ((r2-r1) / (r1 || 1)) * 100
}

function formatNumber(x, n) {
	return x === 0 ? '-' : Number(x).toFixed(n)
}