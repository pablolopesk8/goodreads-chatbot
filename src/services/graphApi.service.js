/**
 * Service to provide an integration with Facebook Graph API
 */
const request = require('request-promise-native');
const camelCase = require("camelcase");
const config = require("../config");

/**
 * Send the HTTP request to the Messenger Profile API
 * @param {Object} messengerProfile
 * @throws {Error} throw errors for invalid greeting (invalid-greeting) or get_started (invalid-getStarted)
 * @return {Boolean}
 */
const SetMessengerProfile = async (messengerProfile) => {
    const options = {
        uri: `${config.facebookGraphUrl}/me/messenger_profile`,
        qs: { access_token: config.facebookPageAccessToken },
        method: "POST",
        json: messengerProfile
    };

    try {
        await request(options);
        return true;
    } catch (err) {
        // Graph API doesn't return type of error, so, the error is handled as generic
        throw new Error("invalid-profile");
    }
}

/**
 * Send the HTTP request to the Graph API to get the Facebook User Profile
 * @param {String} facebookUserId
 * @throws {Error} throw errors for invalid userid (invalid-facebookUserId)
 * @return {Object} object with the profile user data
 */
const GetBasicUserProfile = async (facebookUserId) => {
    const options = {
        uri: `${config.facebookGraphUrl}/${facebookUserId}`,
        qs: { access_token: config.facebookPageAccessToken, fields: "first_name, last_name" },
        method: "GET"
    };

    try {
        let userProfile = await request(options);

        // camelized all data returned by facebook
        userProfile = JSON.parse(userProfile);
        const userProfileReturn = {};
        for (const key in userProfile) {
            userProfileReturn[camelCase(key)] = userProfile[key];
        }

        return userProfileReturn;
    } catch (err) {
        // Graph API doesn't return type of error, so, the error is handled as generic
        throw new Error("invalid-facebookUserId");
    }
}

/**
 * Send the HTTP request to the Graph API to send a message on Messenger
 * @param {String} facebookUserId
 * @param {Object} messageData
 * @throws {Error} throw errors for invalid userid (invalid-facebookUserId) or invalid message (invalid-messageFormat)
 * @return {Boolean}
 */
const SendMessage = async (facebookUserId, messageData) => {
    const options = {
        uri: `${config.facebookGraphUrl}/me/messages`,
        qs: { access_token: config.facebookPageAccessToken },
        method: "POST",
        json: { recipient: { id: facebookUserId }, message: messageData }
    };

    try {
        await request(options);
        return true;
    } catch (err) {
        switch (err.error.error.error_subcode) {
            case 2018001:
            case 2018108:
            case 1545041:
                throw new Error("invalid-facebookUserId");
            default:
                throw new Error("invalid-messageFormat");
        }
    }
}

module.exports = { SetMessengerProfile, GetBasicUserProfile, SendMessage };