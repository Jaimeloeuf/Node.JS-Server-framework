'use strict'; // Enforce use of strict verion of JavaScript

// Dependencies
const { getCTX } = require('./ctx');
const getPayload = require('./req_payload');
const parser = require('./parser');
const router = require('./router');
const finalHandler = require('./finalHandler');
const { debug } = require('./utils');

/* 	@Doc Flow of logic:
	0. Parse req object with getCTX()
	0.1. All async codes are sequenced with Promise chaining
	Promises Logic flow:
	1. Call getPayload to get incoming req payload, when the getPayload Promise resolves after receiving full payload
	2. parser is called to Parse and save payload into 'ctx', when parser resolves
	3. Get a route handler from router and route the 'ctx' to handler
	4. Handle the req with the given ctx, when route-handler/middleware is done,
	5. Call finalHandler and send response back to user
	@Note_to_self: Does the above somehow mean concurreny and parrallelism? See more on this.

	@Notes / @Doc
	In promise land when 1 promise rejects, all the '.then' calls are
	skipped and the trailing '.catch' method is called instead.
	There is no input value for the function in finally() call
	The last '.catch' is called if '.finally' call throws any error.

	@TODO
	Add some features for finalHandler to deal with the error(s) in 'ctx' object
	See if it is feasible to make the unifiedServer function into an async function, using async/await

	Exported function is the unifiedServer used to handle requests from both HTTP and HTTPS server.	*/
module.exports = (req, res) => {
	// Create a new 'ctx' object with (req, res) objects
	// @Note_to_self Should I use const or let/var? Will variable be overwritten during concurrent requests?
	console.time('Cycle time'); // For dev-env only
	const ctx = getCTX(req, res);

	// Promise Chaining to respond back to client
	getPayload(ctx)
		.then((ctx) => parser(ctx))
		.then((ctx) => router(ctx)(ctx))
		.then((ctx) => finalHandler(ctx))
		.catch((err) => ctx.newError(err))
		.finally(() => {
			debug.logout_params(ctx)
			console.timeEnd('Cycle time'); // For dev-env only
		})
		.catch((err) => console.error(err));
}