const should = require('should'); // eslint-disable-line
const { webhookEventValidator } = require('../../src/validators/webhookEvent.validator');

describe('Validator webhookEvent Test', () => {
    it('Should be rejected if has no sender', async () => {
        const data = {};
        await webhookEventValidator(data).should.be.rejectedWith('required-sender');
    });

    it('Should be rejected if sender is not an object', async () => {
        const data = { sender: "wrong" };
        await webhookEventValidator(data).should.be.rejectedWith('type-sender');
    });

    it('Should be rejected if sender has no id', async () => {
        const data = { sender: {} };
        await webhookEventValidator(data).should.be.rejectedWith('required-sender.id');
    });

    it('Should be rejected if sender id is not a string', async () => {
        const data = { sender: { id: 123 } };
        await webhookEventValidator(data).should.be.rejectedWith('type-sender.id');
    });

    it('Should be accepted if has a valid sender with a valid id', async () => {
        const data = { sender: { id: "123456abc" } };
        const result = await webhookEventValidator(data);
        result.should.be.true();
    });

    it('Should be accepted if has a valid sender with a valid id and others attributes', async () => {
        const data = { sender: { id: "123456abc", anyOther: { any: "abc" } }, otherAttr: 123, another: "abc" };
        const result = await webhookEventValidator(data);
        result.should.be.true();
    });
});