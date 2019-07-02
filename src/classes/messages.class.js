/**
 * Class to handle correctly each message received, and send necessary messages
 */
const { SendMessage } = require('../services/graphApi.service');
const { ErrorMessage, NotAcceptableMessage } = require('../services/messageTemplates.service');
const { HandleText, HandleQuickReply, HandlePostback } = require('../services/handleMessages.service');

class MessageClass {
    // constructor method has a default delay, that can be overwrited
    constructor(user, webhookEvent, delay = 1000) {
        this.user = user;
        this.webhookEvent = webhookEvent;
        this.delay = delay;
    }

    async handleMessages() {
        // if this class was created withou messenger id, interrupts the flow
        if (!this.user.messengerId) {
            return false;
        }

        let responses;

        try {
            /**
             * @todo To create validators for webhook events, validating
             *          messages, quick replys and postback structures
             */
            if (this.webhookEvent.message) {
                if (this.webhookEvent.message.text) {
                    // get the response passing the user and the text of message
                    responses = HandleText(this.user, this.webhookEvent.message.text.trim().toLowerCase());
                    await this.sendMessage(responses);

                    return "TEXT_RECEIVED";
                } else if (this.webhookEvent.message.quick_reply) {
                    // get the response passing the user and quick reply content
                    responses = HandleQuickReply(this.user, this.webhookEvent.message.quick_reply);
                    await this.sendMessage(responses);

                    return "QUICK_REPLY_RECEIVED";
                } else {
                    // now, only text and quick reply are allowed for text
                    responses = NotAcceptableMessage();
                    await this.sendMessage(responses);
                    
                    return "NOTACCEPTABLE_SENT";
                }
            } else if (this.webhookEvent.postback) {
                // get the response passing the user and postback content
                responses = HandlePostback(this.user, this.webhookEvent.postback);
                await this.sendMessage(responses);

                return "POSTBACK_RECEIVED";
            } else {
                // now, only message and postback are allowed
                responses = NotAcceptableMessage();
                await this.sendMessage(responses);

                return "NOTACCEPTABLE_SENT";
            }
        } catch (err) {
            /**
             * @todo
             * if occurs any at this point, must to be NOTHING
             * but, in the future, will be created a log system to log the errors
             * now, the only action here is to send a default message to user
             */
            responses = ErrorMessage();
            await this.sendMessage(responses);
            return false;
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
            throw new Error("generic-sendmessage");
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