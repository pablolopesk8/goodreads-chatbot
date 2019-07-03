/**
 * Services to manipulate messages and to define what is the answer
 */
const { WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage } = require('./messageTemplates.service');
const User = require('../models/users.model');
const Book = require('../models/books.model');

const HandleText = async (user, text) => {
    let response;

    response = MisunderstoodMessage();

    return response;
}

const HandlePostback = async (user, postback) => {
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
        payload = postback.referral.ref;
    } else {
        payload = postback.payload;
    }

    return HandlePayload(user, payload);
}

const HandleQuickReply = async (user, quickReply) => {
    // Get the payload of the quick reply
    return HandlePayload(user, quickReply.payload);
}

const HandlePayload = async (user, payload) => {
    let response;

    if (payload === 'GET_STARTED') {
        response = WelcomeMessage(user.firstName);
        user.currentState = 'CHOOSING_TYPE_SEARCH';
        await User.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_TYPE_SEARCH' });
    } else {
        response = MisunderstoodMessage();
    }

    return response;
}

module.exports = { HandleText, HandleQuickReply, HandlePostback };