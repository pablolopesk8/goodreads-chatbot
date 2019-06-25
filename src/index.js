'use strict';

// Express init
const express = require('express');
const server = express();

// Body parser config
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Get config variables
const config = require('./config');

// Get database and connect
const { DBConnect } = require('./services/db.service');

DBConnect().then(
    () => {
        /*** the server is only started if connected successfully on database ***/

        // listener to get requests for /
        server.get('/', (req, res) => {
            res.send('Goodreads Chatbot is working!!!');
        });

        // start server on the port defined by env
        server.app = server.listen(config.portApi, () => {
            // in dev, emit an event to be catch in integration tests
            if (env === 'dev'){
                server.emit('server-started');
            }            
            console.log(`Server listening on port ${config.portApi}`);
        });
    },
    (err) => {
        console.log(err);
    }
);

module.exports = server;