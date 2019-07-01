const should = require('should'); // eslint-disable-line
const Messages = require('../../src/classes/messages.class');
const { WelcomeMessage } = require('../../src/services/messageTemplates.service');

// variable to be used in tests
const validFacebookSenderId = '1644224095634421';

describe('Messages Class Test', () => {
    describe('Class constructor', () => {
        it('Should be created correctly when passed user and webhook', async () => {
            const message = new Messages({}, [{}]);
            message.should.be.instanceOf(Messages);
            message.should.have.property('user').and.be.a.Object();
            message.should.have.property('webhookEvent').and.be.a.Array();
        });
        it('Should be not created correctly when not passed user', async () => {
            const message = new Messages(undefined, [{}]);
            message.should.be.instanceOf(Messages);
            message.should.have.property('user').and.be.undefined();
            message.should.have.property('webhookEvent').and.be.a.Array();
        });
        it('Should be not created correctly when not passed webhook', async () => {
            const message = new Messages({}, undefined);
            message.should.be.instanceOf(Messages);
            message.should.have.property('user').and.be.a.Object();
            message.should.have.property('webhookEvent').and.be.undefined();
        });
    });
    describe('Send Message Method', () => {
        it('Should be sent correctly if message was created correctly', async () => {
            const user = { messengerId: validFacebookSenderId, firstName: 'teste' };
            const webhookEvent = [{}];
            const msgTemplate = WelcomeMessage(user.firstName);
            const message = new Messages(user, webhookEvent);
            const result = await message.sendMessage(msgTemplate);
            result.should.be.true();
        });
        it('Should be sent incorrectly if message was created incorrectly', async () => {
            const user = { messengerId: validFacebookSenderId, firstName: 'teste' };
            const webhookEvent = [{}];
            const msgTemplate = "not a valid template";
            const message = new Messages(user, webhookEvent);
            const result = await message.sendMessage(msgTemplate);
            result.should.be.false();
        });
        it('Should be sent incorrectly if user was incorrectly', async () => {
            const user = { firstName: 'teste' };
            const webhookEvent = [{}];
            const msgTemplate = WelcomeMessage(user.firstName);
            const message = new Messages(user, webhookEvent);
            const result = await message.sendMessage(msgTemplate);
            result.should.be.false();
        });
    });
});