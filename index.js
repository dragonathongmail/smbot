// var express = require('express');
// var app = express();
//
// app.set('port', (process.env.PORT || 5000));
//
// app.use(express.static(__dirname + '/public'));
//
// // views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
//
// app.get('/', function(request, response) {
//   response.render('pages/index');
// });
//
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

'use strict';
const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 5000
});

// Add the route
server.route({
    method: 'GET',
    path: '/webhook',
    handler: function (request, reply) {
        if (request.query['hub.mode'] === 'subscribe' &&
            request.query['hub.verify_token'] === process.env.VERIFY_TOKEN||'my_super_secrect_token') {
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
    console.log('VERIFY_TOKEN:' + process.env.VERIFY_TOKEN);
});