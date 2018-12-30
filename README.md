# Project / Repo description
This project is made while following a class from the website [pirple.thinkific.com](pirple.thinkific.com)
It is supposed to be a simple API server made in Node JS with no external dependencies.
Focused on using native libraries to implment most of the functionalities that a framework will give you,
and by doing so, you get to learn the inner workings of many things and the software design patterns.

I've have followed the class and work on the code more to make it a little bit different and hopefully
better too? The main difference is that my code is more modularised and I used Promises quite extensively
to sequence my Async code in the right manner.

Although the class did not use any external dependencies and all, I do currently have one external dependency
for the generation and verification of Json Web Tokens. I did some token auth with the module as I learn more
about it. I will perhaps one day phase it out and replace it with my own custom made Vanilla NodeJS solution,
but for now, I will stick with it and perhaps even introduce more dependencies in the future.
I will only be adding dependencies when I feel absolutely required/needed or just good to have in some places,
such as JWT and perhaps to implement the BCrypt hash function.

Currently in works of trying to make this into a JS Framework.
The focus of this project/server/framework is optimization, performance and reduced dependencies.

# To anyone who wants to use this for whatever reasons.
I do not garuntee that this thing will work or whatsoever, this is meant as a learning experience for myself,
so if you want to look at my code for reference or to learn I'm cool with that, but if you use it for
production and bring down ur servers, that I ain't got nothing on that. If for whatever reason you see a bug
or smth you wanna fix, do submit a pull request to me too! :)

##On Windows
Since Windows uses PowerShell as the default shell, use the below command
to set environmental variables.
```powershell
$env:NODE_ENV="production"
```

##Tests
Test folder structure:
- test.yml	=> Yaml file to store run commands for artillery testing tool
###To use
Run the artillery tool with the newly created yml file with below command:
```powershell
artillery run test.yml
```

##API and usage
```js
// Get a reference to the framework via the fw module.
const app = require('./fw');

/*	This fw allows you to define a route and a handler for that route.
	
	You can create/define routes based on their expected request methods with the built in methods like
	.get()  .post()  .put()  .del()

	Notice that you do not need to call the next middleware/function in the cycle, as the fw takes care
	of it in the server module of this framework. The methods exposed fw just adds that route that you
	defined into the server's router and add the annonymous function as the handler for that route in
	the same server.
*/
// Example ping route that sends back a 200 ok as long as server is up.
app.get('/ping', (ctx) => {
	ctx.setStatusCode(200); // Technically unnecessary as the status code defaults to 200 if not set.
});
```

### About the 'ctx' object created from the Ctx class
The status code property 'statusCode' is a write once and read only property. Meaning that you can only set this value once throughout the request/response cycle. If you try to set it more than once, a error will be thrown and your client will receive a 500 status code.
The status code to be returned to the client is 200 by default. The framework will not change this value by itself unless there is an error in the error array of the 'ctx' object and the status code is set below the error code ranges above 400, the framework will then return a 500 to client to indicate internal error.
So if your client is getting back a 500 code even though you did not set it to 500, check for errors by looking into the error array of the 'ctx' object by turning on dev mode to allow debug function to run.

### Misc info
To Change memory limit/use of the node process, use the below code and change 1024 to desired memory size in MB
```bash
node --max-old-space-size=1024 .\index.js
```

### Resources available from the Framework / Things that are user modifiable
The user of this framework will have access to the:
1.	methods exposed by the fw module and all the methods provided in the 'ctx' object that will be passed in to the route handlers.
2.	The db schema file to define your own db / settings / schema and more
3.	user Config file that will be read in by the config module.
	In this file you can choose to disable default route handlers like ping.