const should = require('should'); // eslint-disable-line
const { handleMessagesBodyValidator } = require('../../src/validators/handleMessagesBody.validator');

describe('Validator HandleMessagesBody Test', () => {
    it('Should be rejected if has no object', async () => {
        const data = {};
        await handleMessagesBodyValidator(data).should.be.rejectedWith('required-object');
    });

    it('Should be rejected if object is not a string', async () => {
        const data = { object: 123 };
        await handleMessagesBodyValidator(data).should.be.rejectedWith('type-object');
    });

    it('Should be rejected if object is different of page', async () => {
        const data = { object: "notpage" };
        await handleMessagesBodyValidator(data).should.be.rejectedWith('pattern-object');
    });

    it('Should be rejected if has no entry', async () => {
        const data = { object: "page" };
        await handleMessagesBodyValidator(data).should.be.rejectedWith('required-entries');
    });

    it('Should be rejected if entry is not array', async () => {
        const data = { object: "page", entries: "not array" };
        await handleMessagesBodyValidator(data).should.be.rejectedWith('type-entries');
    });

    it('Should be accepted if has valids object and entries', async () => {
        const data = { object: "page", entries: [] };
        const result = await handleMessagesBodyValidator(data);
        result.should.be.true();
    });
});