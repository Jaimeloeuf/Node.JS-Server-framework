'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Common module to expose all the utils via a single common module called utils.
	Use object deconstruction to get the functions out.
*/

// Dependencies
const loggers = require('./log');

module.exports = {
	write: loggers.write,
	log: loggers.log,
	log_error: loggers.log_error,
	debug: require('./debug'),
	parseJSON: parseJSON,
};


/* To test if below parseJSON methods work before refactoring out to their own modules. */
// Parse a JSON string to an object in all cases, without throwing
const parseJSON = (str) => {
	try { return JSON.parse(str); }
	catch (e) { return {}; } // Should I return false here instead
};

const parseJSON2 = (str) => {
	return new Promise((resolve, reject) => {
		try { resolve(JSON.parse(str)); }
		catch (err) { reject(err); } // Should I return false here instead
	})
};