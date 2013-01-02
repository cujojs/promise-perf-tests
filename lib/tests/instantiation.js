// Instantiation (10,000 iterations)
// Create a pending instance

var name = process.argv[2].match(/\/([^\/]+)\.js$/)[1]
/**
 * Load the adapter
 */
var lib = require(process.argv[2])

/**
 * Performance of deferred creation
 */
require('../bench')(name, 10000, lib.createNormal)