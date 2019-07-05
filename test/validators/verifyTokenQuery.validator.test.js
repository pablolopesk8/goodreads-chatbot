const should = require('should'); // eslint-disable-line
const { verifyTokenQuery } = require('../../src/validators/verifyTokenQuery.validator');

describe('Validator VerifyTokenQuery Test', () => {
    it('Should be rejected if has not mode', async () => {
        const data = {};
        await verifyTokenQuery(data).should.be.rejectedWith('required-mode');
    });

    it('Should be rejected if has not token', async () => {
        const data = { mode: "anystring" };
        await verifyTokenQuery(data).should.be.rejectedWith('required-token');
    });

    it('Should be rejected if has not challenge', async () => {
        const data = { mode: "anystring", token: "anystring" };
        await verifyTokenQuery(data).should.be.rejectedWith('required-challenge');
    });

    it('Should be rejected if mode is not a string', async () => {
        const data = { mode: 456, token: "anystring", challenge: "anystring" };
        await verifyTokenQuery(data).should.be.rejectedWith('type-mode');
    });

    it('Should be rejected if token is not a string', async () => {
        const data = { mode: "anystring", token: 789, challenge: "anystring" };
        await verifyTokenQuery(data).should.be.rejectedWith('type-token');
    });

    it('Should be rejected if challenge is not a string', async () => {
        const data = { mode: "anystring", token: "anystring", challenge: 123 };
        await verifyTokenQuery(data).should.be.rejectedWith('type-challenge');
    });

    it('Should be accepted if has valids mode, token and challenge', async () => {
        const data = { mode: "anystring", token: "anystring", challenge: "anystring" };
        const result = await verifyTokenQuery(data);
        result.should.be.true();
    });
});