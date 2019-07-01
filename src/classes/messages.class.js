/**
 * Class to manipulate all messages, creating and sending correctly
 */
const { SendMessage } = require('../services/graphApi.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, ErrorMessage } = require('../services/messageTemplates.service');

class MessageClass {
    // constructor method has a default delay, that can be overwrited
    constructor(user, webhookEvent, delay = 1000) {
        this.user = user;
        this.webhookEvent = webhookEvent;
        this.delay = delay;
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
            /**
             * @todo
             * if occurs any at this point, must to be NOTHING
             * but, in the future, will be created a log system to log the errors
             * now, the only action here is to send a default message to user
             */
            responses = ErrorMessage();
            this.sendMessage(responses);
        }
    }

    /**
     * Send all messages, considering that always receive an array
     * @param {Array} messages array of message objects
     * @return {Boolean}
     */
    async sendMessage(messages) {
        try {
            // messages is ever an array, even one item
            // so, interate in array and send message, sleeping between each
            for (let i = 0, len = messages.length; i < len; i++) {
                await SendMessage(this.user.messengerId, messages[i]);
                await this.sleep();
            }

            return true;
        } catch (err) {
            /**
             * @todo
             * if occurs any error when sending message, must to be NOTHING
             * but, in the future, will be created a log system to log the errors
             * now, the only action here is return false
             */
            //console.log(err);
            return false;
        }
    }

    /**
     * internal method to make a pause during any execution
     */
    sleep() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    }
}

module.exports = MessageClass;