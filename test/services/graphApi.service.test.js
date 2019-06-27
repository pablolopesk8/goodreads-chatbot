const should = require('should'); // eslint-disable-line
const { SetMessengerProfile, GetBasicUserProfile, SendMessage } = require('../../src/services/graphApi.service');

// variable to be used in tests
const validFacebookUserId = '3042011692538983';
const invalidFacebookUserId = '1234567890123456';
const validFacebookSenderId = '1644224095634421';

describe('GraphApi Service Test', () => {
    describe('Set Messenger Profile', () => {
        it('Should be able to update the Messenger Profile, passing valids greeting and get_started', async () => {
            const data = {
                greeting: [{ locale: "default", text: "I'm a bot for test!" }],
                get_started: { payload: "GET_STARTED" }
            };

            const result = await SetMessengerProfile(data);
            result.should.be.true;
        });

        it('Should not be able to update the Messenger Profile, passing invalid greeting', async () => {
            const data = {
                greeting: { locale: "default", text: "I'm a bot for test!" }
            };

            try {
                await SetMessengerProfile(data);
            } catch (err) {
                err.message.should.be.equal('invalid-profile');
            }
        });

        it('Should not be able to update the Messenger Profile, passing invalid get_started', async () => {
            const data = {
                greeting: [{ locale: "default", text: "I'm a bot for test!" }],
                get_started: {}
            };

            try {
                await SetMessengerProfile(data);
            } catch (err) {
                err.message.should.be.equal('invalid-profile');
            }
        });
    });
    
    describe('Get User Profile', () => {
        it('Should be able to get user profile with a valid userId', async () => {
            const userProfile = await GetBasicUserProfile(validFacebookUserId);
            userProfile.should.have.properties(['id', 'firstName', 'lastName']);
        });

        it('Should not be able to get user profile with an invalid user', async () => {
            try {
                await GetBasicUserProfile(invalidFacebookUserId);
            } catch (err) {
                err.message.should.be.equal('invalid-facebookUserId');
            }
        });
    });

    describe('Send Message', () => {
        it('Should be able to send a message, passing valids userId and message', async () => {
            const msg = { text: "Some text" };

            const result = await SendMessage(validFacebookSenderId, msg);
            result.should.be.true;
        });

        it('Should not be able to send a message, passing invalid userId', async () => {
            const msg = { text: "Some text" };

            try {
                await SendMessage(invalidFacebookUserId, msg);
            } catch (err) {
                err.message.should.be.equal('invalid-facebookUserId');
            }
        });

        it('Should not be able to send a message, passing invalid message', async () => {
            const msg = { incorrectAttr: 123456 };

            try {
                await SendMessage(validFacebookSenderId, msg);
            } catch (err) {
                err.message.should.be.equal('invalid-messageFormat');
            }
        });
    });
});