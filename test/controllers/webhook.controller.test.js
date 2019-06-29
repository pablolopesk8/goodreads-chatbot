const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const config = require('../../src/config');
const webhookController = require('../../src/controllers/webhook.controller');

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
            const req = { query: { hub: {  mode: "subscribe", verify_token: config.facebookVerifyToken, challenge: "string for challenge" } } };

            const res = { status: sinon.spy(), send: sinon.spy(), json: sinon.spy() };

            await webhookController.verifyToken(req, res);

            res.status.calledWith(200).should.equal(true);
            res.send.calledWith(req.query.hub.challenge).should.equal(true);
        });
    });
});