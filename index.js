'use strict';
const fs = require('fs');

// The rest of the code implements the routes for our Express server.
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: process.env.PORT || 8080
});

// Add the route
server.route({
    method: 'GET',
    path:'/webhook',
    handler: function (request, reply) {
        if (request.query['hub.mode'] === 'subscribe' &&
            request.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
            console.log("Validating webhook");
            reply(request.query['hub.challenge']).code(200);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            reply("Failed validation").code(403);
        }
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
    console.log(process.env);
});