const should = require('should'); // eslint-disable-line
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const Users = require('../../src/models/users.model');
const Books = require('../../src/models/books.model');
const { HandleText, HandleQuickReply, HandlePostback } = require('../../src/services/handleMessages.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage } = require('../../src/services/messageTemplates.service');

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

    });

    describe('Handle Postback', () => {
        it(`Should return a 'Welcome Message' and set the 'User State' as CHOOSING_TYPE_SEARCH if sent GET_STARTED`, async () => {
            const webhookEvent = { payload: 'GET_STARTED' };
            const expectedResult = WelcomeMessage(user.firstName);

            const result = await HandlePostback(user, webhookEvent);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
        it(`Should return a 'Affirmative Suggest Message', update the 'User State' as VIEWING_SUGGESTION and the 'Book Choosed' if sent CHOOSE_BOOK_{bookId}`, async () => {
            const webhookEvent = { payload: `CHOOSE_BOOK_${bookGood._id.toString()}` };
            const expectedResult = SuggestMessage('affirmative');

            const result = await HandlePostback(user, webhookEvent);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('VIEWING_SUGGESTION');
            updatedUser.should.have.property('bookChoosed').and.be.equal(bookGood._id.toString());
        });
        it(`Should return a 'Nonconclusive Suggest Message', update the 'User State' as VIEWING_SUGGESTION and the 'Book Choosed' if sent CHOOSE_BOOK_{bookId}`, async () => {
            const webhookEvent = { payload: `CHOOSE_BOOK_${bookDoubt._id.toString()}` };
            const expectedResult = SuggestMessage('nonconclusive');

            const result = await HandlePostback(user, webhookEvent);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('VIEWING_SUGGESTION');
            updatedUser.should.have.property('bookChoosed').and.be.equal(bookDoubt._id.toString());
        });
        it(`Should return a 'Misunderstood Message' and doesn't change the 'User State' if sent an invalid payload`, async () => {
            const webhookEvent = { payload: 'INVALID_PAYLOAD' };
            const expectedResult = MisunderstoodMessage();
            await Users.findByIdAndUpdate(user._id, { currentState: 'SEARCHING_BY_ID' });

            const result = await HandlePostback(user, webhookEvent);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('SEARCHING_BY_ID');
        });
    });
});