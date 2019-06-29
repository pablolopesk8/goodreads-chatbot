const config = require('../config');
const { verifyTokenQuery } = require('../validators/verifyTokenQuery.validator');

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
            //
        } catch (err) {
            // set the message to return
            switch (err.message) {
                default:
                    res.status(500);
                    return res.send("Error in parameters");
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