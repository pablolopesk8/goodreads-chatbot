const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const config = require('../../src/config');
const webhookController = require('../../src/controllers/webhook.controller');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');

// variable to be used in tests
const validFacebookSenderId = '1644224095634421';

describe('Webhook Controller Test', () => {
    describe('GET - Verify Token', () => {
        it('Should be not accpetable if mode is not present on query', async () => {
            const req = { query: { hub: { verify_token: "string", challenge: "string" } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('mode is required and needs to be a string').should.equal(true);
        });
        it('Should be not accpetable if mode is different of subscribe', async () => {
            const req = { query: { hub: { mode: "not subscribe", verify_token: "string", challenge: "string" } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(403).should.equal(true);
        });
        it('Should be not accpetable if verify_token is not present on query', async () => {
            const req = { query: { hub: { mode: "subscribe", challenge: "string" } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('verify_token is required and needs to be a string').should.equal(true);
        });
        it('Should be not accpetable if verify_token is different of the token of app', async () => {
            const req = { query: { hub: { mode: "subscribe", verify_token: "any123tokenA@NotV4lid", challenge: "string" } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(403).should.equal(true);
        });
        it('Should be not accpetable if challenge is not present on query', async () => {
            const req = { query: { hub: { mode: "subscribe", verify_token: config.facebookVerifyToken } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('challenge is required and needs to be a string').should.equal(true);
        });
        it('Should be accpetable if mode, verify_token and challenge is present on query with valid values', async () => {
            const req = { query: { hub: { mode: "subscribe", verify_token: config.facebookVerifyToken, challenge: "string for challenge" } } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(200).should.equal(true);
            res.send.calledWith(req.query.hub.challenge).should.equal(true);
        });
    });

    describe('POST - Webhook', () => {
        // force open and close connection with DB, because it's necessary to execution of this test
        before(async () => {
            await DBConnect();
        });
        after(async () => {
            await DBCloseConnection();
        });
        it('Should be rejected if object is not present on body', async () => {
            const req = { body: { entry: [] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(404).should.equal(true);
        });
        it('Should be rejected if object is different of page', async () => {
            const req = { body: { object: "anything", entry: [] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(404).should.equal(true);
        });
        it('Should be rejected if entries is not present on body', async () => {
            const req = { body: { object: "page" } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('entries is required and needs to be an array').should.equal(true);
        });
        it('Should be rejected if entries is not an array', async () => {
            const req = { body: { object: "page", entry: "not array" } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('entries is required and needs to be an array').should.equal(true);
        });
        it('Should be rejected if a entry has no sender', async () => {
            const req = { body: { object: "page", entry: [{ messaging: [{}] }] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('A sender is required for each entry of message and needs to be an object').should.equal(true);
        });
        it('Should be rejected if a entry has a non object sender', async () => {
            const req = { body: { object: "page", entry: [{ messaging: [{ sender: "non object" }] }] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('A sender is required for each entry of message and needs to be an object').should.equal(true);
        });
        it('Should be rejected if a entry has a sender without id', async () => {
            const req = { body: { object: "page", entry: [{ messaging: [{ sender: {} }] }] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('An id is required for each sender and needs to be a string').should.equal(true);
        });
        it('Should be rejected if a entry has a sender without a non string id', async () => {
            const req = { body: { object: "page", entry: [{ messaging: [{ sender: { id: 123 } }] }] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(422).should.equal(true);
            res.send.calledWith('An id is required for each sender and needs to be a string').should.equal(true);
        });
        it('Should be accpeted if the object and all entries is valid', async () => {
            const req = { body: { object: "page", entry: [{ messaging: [{ sender: { id: validFacebookSenderId } }] }] } };
            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.handleMessages(req, res);

            res.status.calledWith(200).should.equal(true);
            res.send.calledWith('EVENT_RECEIVED').should.equal(true);
        });
    });
});