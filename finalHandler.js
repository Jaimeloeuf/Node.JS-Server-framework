'use strict'; // Enforce use of strict verion of JavaScript

/*	This function is just like the finalHandler in the Express world.

	@DOC Flow of logic in 'finalHandler':
	- Serialize res_body and store result in itself, a variable that is created on
	destructuring the 'ctx' object. Only the variable is changed, meaning the value
	in ctx.res_body called directly is unaffected/unchanged.
	- Set the content length in the response headers with the method from 'ctx' object.
	- Sent the response headers and status code back to the client
	- Sent the response payload back to client and close the connection.
*/
/* @TODO
	How do I serialize res_body and make it into a readable stream to pipe it into 'res' writable stream
	Maybe allow one more option in the handler to specify if they want the payload to be serialized
	Include something to deal with all the errors. Like send them back to the client or log them
*/

// Dependencies
const { debug } = require('./utils');
const { envName } = require('./config').env;

finalHandler = (ctx) => {
	let { res_body } = ctx;
	ctx.setContentLength(res_body = JSON.stringify(res_body));
	ctx.res.writeHead(ctx.statusCode, ctx.res_headers);
	ctx.res.end(res_body);
	return ctx; // To trigger the next .then method
}

function devMode(ctx) {
	fh(ctx); // Call the res, finalHandler

	// Do all the logging and stuff here
	console.timeEnd('Cycle time'); // Print time taken for each full req/res cycle
	console.log(`Servicing req number: ${++reqCount}`); // Count the nummber of requests serviced
	console.log('Mem usage', (process.memoryUsage().rss / 1024 / 1024).toFixed(3)); // In MB
	debug.logout_params(ctx); // Log out the ctx object for debugging
}

/*	Auto choose a finalHandler based on current environment mode
	For production mode, just export the finalHandler.
	For developement environment, add a wrapper function around finalHandler
	to call the debuggin and logging stuff after finalHandler is called.
*/
module.exports = (envName === 'dev') ? devMode : finalHandler;

/*	Referring to code below:
	Alternative method for setting headers, as node caches the headers internally
	and not write them directly to the client, res.getHeaders() can be called
	to see what are the headers set before sending them out. This method should
	be used when you need to modify/access the headers after setting them. E.g.
	when you set headers in a middleware but only use writeHead in the finalHandler
*/
// for (let header in res_headers)
// 	res.setHeader(header, res_headers[header]);
// res.writeHead(ctx.statusCode);