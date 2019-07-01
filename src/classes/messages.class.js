/**
 * Class to manipulate all messages, creating and sending correctly
 */
const { SendMessage } = require('../services/graphApi.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, ErrorMessage } = require('../services/messageTemplates.service');

class MessageClass {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }

    handleMessages() {
        let responses;

        try {
            if (this.webhookEvent.message) {
                //
            } else if (this.webhookEvent.postback) {
                //
            } else {
                // now, only message and postback are allowed
                responses = ErrorMessage();
                this.sendMessage(responses);
            }
        } catch (err) {
            responses = ErrorMessage();
            this.sendMessage(responses);
        }
    }

    sendMessage(messages) {
        // message is ever an array, even when has only one message
        let delay = 0;
        for (let message of messages) {
            // call Graph to send message, using timeout to make the necessary delay
            setTimeout(() => SendMessage(this.user.messengerId ,message), delay);
            delay++;
        }
    }
}

module.exports = MessageClass;