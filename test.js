function report(name, iterations, start) {
	var elapsed = Date.now() - start;
	console.log(name);
	console.log(' total: ' + elapsed + 'ms');
	console.log(' avg: ' + (elapsed/iterations) + 'ms');
}