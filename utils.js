'use strict'; // Enforce use of strict verion of JavaScript

// Version 1 of write, assumes that it must be a string an no error is made during usage
const write = (str) => process.stdout.write(str);
// Version 2 of write, currently Deperecated 'write' function below
// const write = (str, newline = false) => (typeof (str) !== 'string')
// 	? console.log(str)
// 	: process.stdout.write((newline) ? `${str}\n` : str);

function log() {
	let len = arguments.length;

	// If boolean value is found at the end, use it as condition for newline
	if (typeof (arguments[len - 1]) === 'boolean')
		--len; // Exclude value from being printed out, by reducing the len variable

	for (let i = 0; i < len; i++) {
		let data = arguments[i];
		// Use console.log() for printing out objects, or non strings
		(typeof (data) !== 'string')
			? console.log(data) // As console.log function can handle non-string data types automatically
			: write(data);
	}

	// If the last arguement is a boolean and is 'false', or if last printed arguement is not a string.
	if (((typeof (arguments[len]) === 'boolean') && (!arguments[len])) || (typeof (arguments[len - 1]) !== 'string'))
		return; // End the function without any trailing new lines characters
	console.log(); // Print a trailing new line
}

// @TODO write a condition to check the environment. Disable debug object if envName = 'production'
const debug = {
	console_lines: (n) => {
		// Print out 'n' number of dashes on the console, used to seperate stuff
		while (--n) // A reverse while loop, more efficient than the old for loop
			write('-');
	},

	logout_params(ctx) {
		// Debug middleware to log out details from ctx object
		debug.console_lines(90);
		// Items from Req obj
		log(`\nRequested path: '${ctx.path}'`);
		log(`Request method: '${ctx.method}'`);
		log('Queries received in url = ', ctx.query);
		log('Headers received = ', ctx.headers);
		if (ctx.req_body)	// Log req_body if any
			log('Request Body: ', ctx.req_body);
		debug.console_lines(60);
		// Items from Res obj
		log(`\nResponse status code: ${ctx.statusCode}`);
		log('Response Headers are = ', ctx.res_headers);
		log('Response Body: ', ctx.res_body);
		// Log Error if any
		if (ctx.error.length) {
			debug.console_lines(60);
			log('\nErrors in error array for current ctx:\n', ctx.error);
		}
	},
	error: (err) => log(err)
};

const { envName } = env;
if (envName === 'production') {
	console.log = () => {};
}

const debug = {
	logout_params(ctx) {
		if (env.envName === 'production')
			return;
		// Debug middleware to log out details from ctx object
		debug.console_lines(90);
		// Items from Req obj
		log(`\nRequested path: '${ctx.path}'`);
		log(`Request method: '${ctx.method}'`);
		log('Queries received in url = ', ctx.query);
		log('Headers received = ', ctx.headers);
		if (ctx.req_body)	// Log req_body if any
			log('Request Body: ', ctx.req_body);
		debug.console_lines(60);
		// Items from Res obj
		log(`\nResponse status code: ${ctx.statusCode}`);
		log('Response Headers are = ', ctx.res_headers);
		log('Response Body: ', ctx.res_body);
		// Log Error if any
		if (ctx.error.length) {
			debug.console_lines(60);
			log('\nErrors in error array for current ctx:\n', ctx.error);
		}
	},
	error: (err) => log(err)
};

module.exports = {
	log: log,
	debug: debug
};