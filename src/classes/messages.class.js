/**
 * Class to manipulate all messages, creating and sending correctly
 */
const { SendMessage } = require('../services/graphApi.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, ErrorMessage, NotAcceptableMessage, Misunderstood } = require('../services/messageTemplates.service');

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
                    responses = this.handleText();
                    await this.sendMessage(responses);
                    return "TEXT_RECEIVED";
                } else if (this.webhookEvent.message.quick_reply) {
                    responses = this.handleQuickReply();
                    await this.sendMessage(responses);
                    return "QUICK_REPLY_RECEIVED";
                } else {
                    // now, only text and quick reply are allowed for text
                    responses = NotAcceptableMessage();
                    await this.sendMessage(responses);
                    return "NOTACCEPTABLE_SENT";
                }
            } else if (this.webhookEvent.postback) {
                responses = this.handlePostback();
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

    handleText() {
        let response;

        response = Misunderstood();

        return response;
    }

    handlePostback() {
        let postback = this.webhookEvent.postback;

        // Check for the special Get Starded with referral
        let payload;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            payload = postback.referral.ref;
        } else {
            payload = postback.payload;
        }

        return this.handlePayload(payload);
    }

    handleQuickReply() {
        // Get the payload of the quick reply
        return this.handlePayload(this.webhookEvent.message.quick_reply.payload);
    }

    handlePayload(payload) {
        let response;

        if (payload === 'GET_STARTED') {
            response = WelcomeMessage(this.user.firstName);
        } else {
            response = Misunderstood();
        }

        return response;
    }
}

module.exports = MessageClass;