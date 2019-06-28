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

// Get routers
const webhookRouter = require('./routers/webhook.routers');

DBConnect().then(
    () => {
        /*** the server is only started if connected successfully on database ***/

        // listener to get requests for /
        server.get('/', (req, res) => {
            res.send('Goodreads Chatbot is working!!!');
        });
        server.use('/webhook', webhookRouter);

        // Creates the endpoint for your webhook
        server.post("/webhook", (req, res) => {
            let body = req.body;

            // Checks if this is an event from a page subscription
            if (body.object === "page") {
                // Returns a '200 OK' response to all requests
                res.status(200).send("EVENT_RECEIVED");

                // Iterates over each entry - there may be multiple if batched
                body.entry.forEach(function (entry) {
                    // Gets the body of the webhook event
                    let webhookEvent = entry.messaging[0];

                    // Get the sender PSID
                    let senderPsid = webhookEvent.sender.id;

                    if (!(senderPsid in users)) {
                        let user = new User(senderPsid);

                        GraphAPi.getUserProfile(senderPsid)
                            .then(userProfile => {
                                user.setProfile(userProfile);
                            })
                            .catch(error => {
                                // The profile is unavailable
                                console.log("Profile is unavailable:", error);
                            })
                            .finally(() => {
                                users[senderPsid] = user;
                                i18n.setLocale(user.locale);
                                console.log(
                                    "New Profile PSID:",
                                    senderPsid,
                                    "with locale:",
                                    i18n.getLocale()
                                );
                                let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                                return receiveMessage.handleMessage();
                            });
                    } else {
                        i18n.setLocale(users[senderPsid].locale);
                        console.log(
                            "Profile already exists PSID:",
                            senderPsid,
                            "with locale:",
                            i18n.getLocale()
                        );
                        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                        return receiveMessage.handleMessage();
                    }
                });
            } else {
                // Returns a '404 Not Found' if event is not from a page subscription
                res.sendStatus(404);
            }
        });

        // start server on the port defined by env
        server.app = server.listen(config.portApi, () => {
            // in dev, emit an event to be catch in integration tests
            if (config.env === 'dev') {
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