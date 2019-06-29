const config = require('../config');
const { verifyTokenQuery } = require('../validators/verifyTokenQuery.validator');
const { handleMessagesBodyValidator } = require('../validators/handleMessagesBody.validator');
const { webhookEventValidator } = require('../validators/webhookEvent.validator');

/**
 * Business rules related to webhook
 */
const controller = function () {
    /**
	 * Handle all messages to webhook
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    const handleMessages = async (req, res) => {
        try {
            // parse and validate the body of request
            const { object, entry: entries } = req.body;
            await handleMessagesBodyValidator({ object, entries });

            // iterates over each entry - there may be multiple if batched
            for (let i = 0, len = entries.length; i < len; i++) {
                // parse and validate the webhook event
                const webhookEvent = entries[i].messaging[0];// todo validate this messaging object
                await webhookEventValidator(webhookEvent);

                // returns a '200 OK' response to all requests
                res.status(200);
                return res.send("EVENT_RECEIVED");

                /* GraphAPi.getUserProfile(senderPsid);
                let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                return receiveMessage.handleMessage(); */
            }
        } catch (err) {
            // set the message to return
            switch (err.message) {
                case "required-object":
                case "type-object":
                case "pattern-object":
                    // Returns a '404 Not Found' if event is not from a page subscription
                    res.status(404);
                    return res.send();
                case "required-entries":
                case "type-entries":
                    res.status(422);
                    return res.send("entries is required and needs to be an array");
                case "required-sender":
                case "type-sender":
                    res.status(422);
                    return res.send("A sender is required for each entry of message and needs to be an object");
                case "required-sender.id":
                case "type-sender.id":
                    res.status(422);
                    return res.send("An id is required for each sender and needs to be a string");
                default:
                    res.status(500);
                    return res.send("Internal Error - We will fix this soon!");
            }
        }
    }

    /**
	 * Verify if token is valid
	 * @param {Request} req 
	 * @param {Response} res 
	 */
    const verifyToken = async (req, res) => {
        try {
            // Parse the query params
            const { mode, verify_token: token, challenge } = req.query.hub;

            // validation of expected query parameters
            await verifyTokenQuery({ mode, token, challenge });

            // if verify token is correct, responds with the challenge token from the request
            if (mode === "subscribe" && token === config.facebookVerifyToken) {
                res.status(200);
                return res.send(challenge);
            } else {
                // if verify tokens do not match, responds with '403 Forbidden'
                res.status(403);
                return res.send();
            }
        } catch (err) {
            // set the message to return
            switch (err.message) {
                case "required-mode":
                case "type-mode":
                    res.status(422);
                    return res.send("mode is required and needs to be a string");
                case "required-token":
                case "type-token":
                    res.status(422);
                    return res.send("verify_token is required and needs to be a string");
                case "required-challenge":
                case "type-challenge":
                    res.status(422);
                    return res.send("challenge is required and needs to be a string");
                default:
                    res.status(500);
                    return res.send("Internal Error - We will fix this soon!");
            }
        }
    }

    return {
        handleMessages: handleMessages,
        verifyToken: verifyToken
    }
}

module.exports = controller();