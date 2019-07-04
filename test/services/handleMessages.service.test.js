const should = require('should'); // eslint-disable-line
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const Users = require('../../src/models/users.model');
const Books = require('../../src/models/books.model');
const { HandleText, HandleQuickReply, HandlePostback } = require('../../src/services/handleMessages.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage, StartOverMessage, AskIdOrNameMessage } = require('../../src/services/messageTemplates.service');

// variable to be used in tests
let user;
let bookGood;
let bookDoubt;

describe('Handle Messages Service Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();

        // before start the tests, create an user to be used in the tests
        user = await Users.create({ messengerId: '1644224095634421', firstName: 'Testuser' });
        user = user.toJSON();

        // before start the tests, create books to be used in the tests
        bookGood = await Books.create({
            goodreadsId: '27598494',
            title: 'Elon Musk: The Biography Of A Modern Day Renaissance Man',
            author: 'Steve Gold',
            smallImage: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
            isbn: 'B016OFGWNI'
        });
        bookGood = bookGood.toJSON();

        bookDoubt = await Books.create({
            goodreadsId: '27765527',
            title: 'About the Serious Message of the Play Auto Da Compadecida',
            author: 'Laura Smith',
            smallImage: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png',
            isbn: '3656937516'
        });
        bookDoubt = bookDoubt.toJSON();
    });
    after(async () => {
        // after the tests, delete the created data
        await Users.findByIdAndDelete(user._id);
        await Books.findByIdAndDelete(bookGood._id);
        await Books.findByIdAndDelete(bookDoubt._id);
        await DBCloseConnection();
    });
    describe('Handle Text', () => {

    });

    describe('Handle Quick Reply', () => {
        it(`Should return a 'Start Over Message' and set the 'User State' as CHOOSING_TYPE_SEARCH if sent START_OVER`, async () => {
            const quickReply = { payload: 'START_OVER' };
            const expectedResult = StartOverMessage();

            const result = await HandleQuickReply(user, quickReply);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
        it(`Should return a 'Ask For Id or Name Message' and set the 'User State' as ASKING_FOR_ID if sent SEARCH_BY_ID`, async () => {
            const quickReply = { payload: 'SEARCH_BY_ID' };
            const expectedResult = AskIdOrNameMessage('id');

            const result = await HandleQuickReply(user, quickReply);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('ASKING_FOR_ID');
        });
        it(`Should return a 'Ask For Id or Name Message' and set the 'User State' as ASKING_FOR_NAME if sent SEARCH_BY_NAME`, async () => {
            const quickReply = { payload: 'SEARCH_BY_NAME' };
            const expectedResult = AskIdOrNameMessage('name');

            const result = await HandleQuickReply(user, quickReply);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('ASKING_FOR_NAME');
        });
        it(`Should return a 'Misunderstood Message', doesn't change the 'User State' and set the 'timesNotUnderstand' with 1 if sent an invalid SEARCH_FOR`, async () => {
            const quickReply = { payload: 'SEARCH_FOR_OTHER' };
            const expectedResult = MisunderstoodMessage();
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_BOOK', timesNotUnderstand: 0 });

            const result = await HandleQuickReply(user, quickReply);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_BOOK');
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(1);
        });
        it(`Should return a 'Misunderstood Message', doesn't change the 'User State' and set the 'timesNotUnderstand' with 1 if sent an invalid quick reply`, async () => {
            const quickReply = { payload: 'INVALID_REPLY' };
            const expectedResult = MisunderstoodMessage();
            await Users.findByIdAndUpdate(user._id, { currentState: 'SEARCHING_BY_TITLE', timesNotUnderstand: 0 });

            const result = await HandleQuickReply(user, quickReply);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('SEARCHING_BY_TITLE');
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(1);
        });
    });

    describe('Handle Postback', () => {
        it(`Should return a 'Welcome Message' and set the 'User State' as CHOOSING_TYPE_SEARCH if sent GET_STARTED`, async () => {
            const postback = { payload: 'GET_STARTED' };
            const expectedResult = WelcomeMessage(user.firstName);

            const result = await HandlePostback(user, postback);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
        it(`Should return a 'Affirmative Suggest Message', update the 'User State' as VIEWING_SUGGESTION and the 'Book Choosed' if sent CHOOSE_BOOK_{bookId}`, async () => {
            const postback = { payload: `CHOOSE_BOOK_${bookGood._id.toString()}` };
            const expectedResult = SuggestMessage('affirmative');

            const result = await HandlePostback(user, postback);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('VIEWING_SUGGESTION');
            updatedUser.should.have.property('bookChoosed').and.be.equal(bookGood._id.toString());
        });
        it(`Should return a 'Nonconclusive Suggest Message', update the 'User State' as VIEWING_SUGGESTION and the 'Book Choosed' if sent CHOOSE_BOOK_{bookId}`, async () => {
            const postback = { payload: `CHOOSE_BOOK_${bookDoubt._id.toString()}` };
            const expectedResult = SuggestMessage('nonconclusive');

            const result = await HandlePostback(user, postback);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('VIEWING_SUGGESTION');
            updatedUser.should.have.property('bookChoosed').and.be.equal(bookDoubt._id.toString());
        });
        it(`Should return a 'Misunderstood Message', doesn't change the 'User State' and set the 'timesNotUnderstand' with 1 if sent an invalid payload`, async () => {
            const postback = { payload: 'INVALID_PAYLOAD' };
            const expectedResult = MisunderstoodMessage();
            await Users.findByIdAndUpdate(user._id, { currentState: 'SEARCHING_BY_ID', timesNotUnderstand: 0 });

            const result = await HandlePostback(user, postback);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('SEARCHING_BY_ID');
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(1);
        });
    });
});