'use strict'; // Enforce use of strict verion of JavaScript

// Dependencies
const url = require('url');

/* Global var */
/* Create once, store many times. Prevent variable creation every single time getCTX method is called
Function can use this variable created at program startup by overwrite the value every single time */
var parsedUrl;

/* @Doc
	Copying koa.js idea on using a ctx object
	Where ctx is an object containing both the req and res objects and
	data parsed from those 'req,res' objects.
	It exposes a easy to use and clean interface for passing data downstream
	in a middleware lifecycle, with many commonly used built in methods.

	@TODO
	This is currently a Factory function for 'ctx' object
	Should I change this factory function into a Class,
	with prototypes to extend its functionailty/capability
	Learn how to use function prototypes like below:
	getCTX.prototype.req = req;
*/
module.exports.getCTX = (req, res) => {
	// Get URL and parse it, parse query strings if any in url
	parsedUrl = url.parse(req.url, true);

	// Construct and return ctx object
	return {
		req: req,
		res: res,

		// Parsed url object
		url: parsedUrl,
		// Get the path. Remove / from the start and the end, but keep those in the middle.
		path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
		// Get the request method, make all upper case for consistency
		method: req.method.toUpperCase(),
		// Get headers as an object
		headers: req.headers,
		// User Agent header for analytics
		// userAgent: req.headers['user-agent'];
		// Get the contentType of the incoming req payload, to be used for parsing the payload
		contentType: req.headers["content-type"],
		// Method to check if content-type of incoming req payload is equals to given type
		checkContentType: (type) => type === req.headers["content-type"],
		// Get the query string as an object
		query: parsedUrl.query,
		// Get the cookies in the headers
		cookies: req.headers['cookies'],
		// @TODO implement a method to deal with the cookies above.

		// Setting Defaults for response object
		statusCode: 200,
		res_headers: {
			'content-type': 'application/json', // Default response of API server should be in JSON
			'cache-control': 'no-cache', // The default cache-control should be changed to suite the needs of prod env
			'content-length': 0, // MUST be set by finalHandler else client will hang as it waits for the server
		},
		setContentLength: function (body) { return this.res_headers['content-length'] = Buffer.byteLength(body); },
		res_body: {},

		// @TODO to test and improve on the res_cookies below
		res_cookies: [],
		newCookie(cookie) {
			this.res_cookies.push(cookie);
		},

		// Any middleware can add its error output to this error object which will be logged tgt at the end.
		error: [],
		// Method to push new error into the error array.
		newError(err) { this.error.push(err); }
	};
}