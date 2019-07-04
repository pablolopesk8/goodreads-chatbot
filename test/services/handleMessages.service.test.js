const should = require('should'); // eslint-disable-line
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');
const Users = require('../../src/models/users.model');
const Books = require('../../src/models/books.model');
const { HandleText, HandleQuickReply, HandlePostback, GetMisunderstoodMessage } = require('../../src/services/handleMessages.service');
const {
    WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage, StartOverMessage, AskIdOrNameMessage, AdviceStartOverMessage,
    TipChoosingSearchMessage, TipChoosedBookMessage, TipChoosingBookMessage, TipSearchingByMessage, TipViewingSuggestionMessage

} = require('../../src/services/messageTemplates.service');

// variable to be used in tests
let user;
let bookGood;
let bookDoubt;

describe('Handle Messages Service Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();

        // delete user and books to avoid errors for unique key
        await Users.deleteOne({ messengerId: '1644224095634421' });
        await Books.deleteOne({ goodreadsId: '27598494' });
        await Books.deleteOne({ goodreadsId: '27765527' });

        // create an user to be used in the tests
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
        it(`Should return a 'Book List Message' with 5 itens and change the 'User State' for CHOOSING_BOOK if passed a name and the 'User State' is ASKING_FOR_NAME`, async () => {
            const text = "Game of Thrones";
            user.currentState = 'ASKING_FOR_NAME';
            await Users.findByIdAndUpdate(user._id, { currentState: 'ASKING_FOR_NAME' });

            const result = await HandleText(user, text);
            
            result.should.be.a.Array();
            result[0].should.have.property('text').and.be.a.String();
            result[1].should.have.property('attachment');
            result[1].attachment.should.have.property('payload');
            result[1].attachment.payload.should.have.property('template_type').and.be.equal('generic');
            result[1].attachment.payload.should.have.property('elements').and.be.a.Array().and.be.length(5);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_BOOK');
        });
        it(`Should return a 'Book List Message' with one item and change the 'User State' for CHOOSING_BOOK if id passed is valid and the 'User State' is ASKING_FOR_ID`, async () => {
            const text = "27765527";
            user.currentState = 'ASKING_FOR_ID';
            await Users.findByIdAndUpdate(user._id, { currentState: 'ASKING_FOR_ID' });

            const result = await HandleText(user, text);
            
            result.should.be.a.Array();
            result[0].should.have.property('text').and.be.a.String();
            result[1].should.have.property('attachment');
            result[1].attachment.should.have.property('payload');
            result[1].attachment.payload.should.have.property('template_type').and.be.equal('generic');
            result[1].attachment.payload.should.have.property('elements').and.be.a.Array().and.be.length(1);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_BOOK');
        });
        it(`Should return a 'Start Over Message' and set the 'User State' as CHOOSING_TYPE_SEARCH if the text sent is equal 'Start Over'`, async () => {
            const text = "start over";
            const expectedResult = StartOverMessage();

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
        it(`Should return a tip about 'Choosing Type Search' state and doesn't change the 'User State' if the 'User State' is CHOOSING_TYPE_SEARCH`, async () => {
            const text = "any text here";
            const expectedResult = TipChoosingSearchMessage();
            user.currentState = 'CHOOSING_TYPE_SEARCH';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_TYPE_SEARCH' });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_TYPE_SEARCH');
        });
        it(`Should return a tip about 'Search By' state and doesn't change the 'User State' if the 'User State' is SEARCHING_BY_{ID|TITLE}`, async () => {
            const text = "any text here";
            const expectedResult = TipSearchingByMessage();
            user.currentState = 'SEARCHING_BY_TITLE';
            await Users.findByIdAndUpdate(user._id, { currentState: 'SEARCHING_BY_TITLE' });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('SEARCHING_BY_TITLE');
        });
        it(`Should return a tip about 'Choosing Book' state and doesn't change the 'User State' if the 'User State' is CHOOSING_BOOK`, async () => {
            const text = "any text here";
            const expectedResult = TipChoosingBookMessage();
            user.currentState = 'CHOOSING_BOOK';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_BOOK' });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSING_BOOK');
        });
        it(`Should return a tip about 'Choosed Book' state and doesn't change the 'User State' if the 'User State' is CHOOSED_BOOK`, async () => {
            const text = "any text here";
            const expectedResult = TipChoosedBookMessage();
            user.currentState = 'CHOOSED_BOOK';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSED_BOOK' });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('CHOOSED_BOOK');
        });
        it(`Should return a tip about 'Viewing Suggestion' state and doesn't change the 'User State' if the 'User State' is VIEWING_SUGGESTION`, async () => {
            const text = "any text here";
            const expectedResult = TipViewingSuggestionMessage();
            user.currentState = 'VIEWING_SUGGESTION';
            await Users.findByIdAndUpdate(user._id, { currentState: 'VIEWING_SUGGESTION' });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal('VIEWING_SUGGESTION');
        });
        it(`Should return a 'Misunderstood Message', doesn't change the 'User State' and set the 'timesNotUnderstand' with 1 if is any other state`, async () => {
            const text = "any text here";
            const expectedResult = MisunderstoodMessage();
            user.currentState = null;
            await Users.findByIdAndUpdate(user._id, { currentState: null, timesNotUnderstand: 0 });

            const result = await HandleText(user, text);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('currentState').and.be.equal(null);
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(1);
        });
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

    describe('Get Misunderstood Message', () => {
        it(`Should return a 'Misunderstood Message' and plus 1 time when the 'timesNotUnderstand' is less than 3`, async () => {
            const expectedResult = MisunderstoodMessage();
            user.timesNotUnderstand = 2;
            await Users.findByIdAndUpdate(user._id, { timesNotUnderstand: 2 });

            const result = await GetMisunderstoodMessage(user);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(3);
        });
        it(`Should return a 'Advice Start Over Message' and 0 times when the 'timesNotUnderstand' is greater than or equal 3`, async () => {
            const expectedResult = AdviceStartOverMessage();
            user.timesNotUnderstand = 3;
            await Users.findByIdAndUpdate(user._id, { timesNotUnderstand: 3 });

            const result = await GetMisunderstoodMessage(user);
            result.should.be.deepEqual(expectedResult);

            const updatedUser = await Users.findById(user._id);
            updatedUser.should.have.property('timesNotUnderstand').and.be.equal(0);
        });
    });
});