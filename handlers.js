'use strict'; // Enforce use of strict verion of JavaScript

const handler = {};

// Login handler
handler.login = (ctx) => {
	// if (async auth_db(headers.authentication)) {
	// 	await ok();
	// 	Add cookie to Headers of Response object
	// 	ctx.res_headers.cookie = { 'Set-cookie': `${cookie}; ${expiry_date};` }
	// 	next(307, { 'location': `/${location}` })
	// }
	return ctx; // To trigger the next .then method
}
// logout handler
handler.logout = (ctx) => {

	return ctx; // To trigger the next .then method
}

// Sample handler using 'ctx'
handler.sample = (ctx) => {
	// Send back a HTTP code and a 'res' payload
	ctx.statusCode = 201;
	ctx.res_body = { 'handler name': 'sample handler' };
	return ctx; // To trigger the next .then method
};

// Example code below to test out the idea
// Sample handler to test returning a Promise using 'ctx'
handler.sample2 = (ctx) => {
	// Send back a HTTP code and a 'res' payload
	return new Promise((resolve, reject) => {
		ctx.statusCode = 201;
		ctx.res_body = { 'handler name': 'sample handler' };
		
		// Call to DB...... need to wait
		ctx.res_body.data = db.getData(ctx.req_payload.userID);
		if (ctx.res_body.data) // If data is not undefined
			return resolve(ctx); // To trigger the next .then method
		return reject('ERROR: Cannot retrieve data from database, user dont exist');
	});
};

// Ping handler to see if server is up
handler.ping = (ctx) => {
	// Actually the statusCode does need to be set, as 200 is the default value
	ctx.statusCode = 200; // Send back a HTTP code to indicate server is up
	return ctx; // To trigger the next .then method
};

// Not found handler
handler.notFound = (ctx) => {
	ctx.statusCode = 404; // Send back a HTTP code to indicate route not defined
	return ctx; // To trigger the next .then method
};

module.exports = handler;