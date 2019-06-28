const should = require('should'); // eslint-disable-line
const { GetEmotion } = require('../../src/services/watsonNlu.service');

describe('Watson NLU Service Test', () => {
    describe('Get the emotion of related texts', () => {
        it('Should be able to get a sentiment passing an array of texts', async () => {
            const texts = [
                "this is an opinion about a book. this is very bad",
                "i think this book is the best of the world",
                "don't buy this book. i rated them. it's very bad"
            ];
            const emotion = await GetEmotion(texts);
            emotion.should.be.a.String();
        });
        it('Should be able to get a sentiment passing one text', async () => {
            const text = "i think this book is the best of the world";
            const emotion = await GetEmotion(text);
            emotion.should.be.a.String();
        });
        it('Should give an error if doesnt pass a text', async () => {
            try {
                await GetEmotion();
            } catch (err) {
                err.message.should.be.equal('text-required');
            }
        });
        it('Should give an error if pass a text in an unsupported language', async () => {
            try {
                await GetEmotion("texto em portugues não é aceito");
            } catch (err) {
                err.message.should.be.equal('unsupported-language');
            }
        });
        it('Should give an error if pass a short text', async () => {
            try {
                await GetEmotion("english");
            } catch (err) {
                err.message.should.be.equal('short-text');
            }
        });
    });
});