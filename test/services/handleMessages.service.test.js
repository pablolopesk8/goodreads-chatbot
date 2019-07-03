const should = require('should'); // eslint-disable-line
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const Users = require('../../src/models/users.model');
const Books = require('../../src/models/books.model');
const { HandleText, HandleQuickReply, HandlePostback } = require('../../src/services/handleMessages.service');
const { WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage } = require('../../src/services/messageTemplates.service');

// variable to be used in tests
let user;
let book;

describe('Handle Messages Service Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();

        // before start the tests, create an user to be used in the tests
        user = await Users.create({ messengerId: '1644224095634421', firstName: 'Testuser' });
        user = user.toJSON();

        // before start the tests, create a book having a good review o be used in the tests
        book = await Books.create({
            goodreadsId: '27598494',
            title: 'Elon Musk: The Biography Of A Modern Day Renaissance Man',
            author: 'Steve Gold',
            smallImage: 'https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png'
        });
        book = book.toJSON();
    });
    after(async () => {
        // after the tests, delete the created data
        await Users.findByIdAndDelete(user._id);
        await Books.findByIdAndDelete(book._id);

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
        it(`Should return a 'Suggest Message' and set the 'User State' as VIEWING_SUGGESTION if sent CHOOSE_BOOK_{bookId}`, async () => {
            const webhookEvent = { postback: { payload: `CHOOSE_BOOK_${book.id}` } };
            const expectedResult = SuggestMessage('affirmative');

            const result = HandlePostback(user, webhookEvent);
            result.should.be.equal(expectedResult);

            const updatedUser = Users.findById(user.id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
    });
});