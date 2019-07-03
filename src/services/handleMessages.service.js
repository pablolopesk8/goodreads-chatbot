/**
 * Services to manipulate messages and to define what is the answer
 */
const { WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage } = require('./messageTemplates.service');
const Users = require('../models/users.model');
const Books = require('../models/books.model');
const { GetReviewsByISBN } = require('../services/goodreadsApi.service');
const { GetEmotion } = require('../services/watsonNlu.service');

const HandleText = async (user, text) => {
    let response;

    response = MisunderstoodMessage();

    return response;
}

/**
 * Handle all postbacks received and redirect to HandlePayload
 * @param {Object|MongooseSchema} user 
 * @param {Object|WebhookEvent} postback 
 */
const HandlePostback = async (user, postback) => {
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
        payload = postback.referral.ref;
    } else {
        payload = postback.payload;
    }

    return HandlePayload(user, payload);
}

const HandleQuickReply = async (user, quickReply) => {
    // Get the payload of the quick reply
    return HandlePayload(user, quickReply.payload);
}

const HandlePayload = async (user, payload) => {
    let response;

    try {
        // manipulate message, user and books according the payload
        if (payload === 'GET_STARTED') {
            response = WelcomeMessage(user.firstName);
            user.currentState = 'CHOOSING_TYPE_SEARCH';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_TYPE_SEARCH' });
        }// payload CHOOSE_BOOK_{ID}
        else if (payload.indexOf('CHOOSE_BOOK_') === 0) {
            const bookId = payload.substring(payload.indexOf('CHOOSE_BOOK_') + 12);
            let book = await Books.findById(bookId);
            book = book.toJSON();

            // set the choosed book and change the current state of user
            user.bookChoosed = book._id;
            user.currentState = 'CHOOSED_BOOK';
            await Users.findByIdAndUpdate(user._id, { bookChoosed: book._id, currentState: 'CHOOSED_BOOK' });

            // get the reviews of the book and set on book
            const reviews = await GetReviewsByISBN(book.isbn);
            book.reviews = reviews;

            // if doesn't exists reviews, is considerated nonconclusive
            if (reviews.length === 0) {
                book.shouldBy = 'DOUBT';
                await Books.findByIdAndUpdate(book._id, { reviews: reviews, shouldBy: 'DOUBT' });
                response = SuggestMessage('nonconclusive');
            } else {
                // get the emotion of the reviews and according with it update the book and get the suggest related
                const emotion = await GetEmotion(reviews.join(' '));
                if (emotion === 'joy') {
                    book.shouldBy = 'YES';
                    await Books.findByIdAndUpdate(book._id, { reviews: reviews, shouldBy: 'YES' })
                    response = SuggestMessage('affirmative');
                } else if (emotion === 'doubt') {
                    book.shouldBy = 'DOUBT';
                    await Books.findByIdAndUpdate(book._id, { reviews: reviews, shouldBy: 'DOUBT' })
                    response = SuggestMessage('nonconclusive');
                } else {
                    book.shouldBy = 'NO';
                    await Books.findByIdAndUpdate(book._id, { reviews: reviews, shouldBy: 'NO' })
                    response = SuggestMessage('negative');
                }
            }

            // in all cases, if the opperations succesfully, current state will be changed
            user.currentState = 'VIEWING_SUGGESTION';
            await Users.findByIdAndUpdate(user._id, { currentState: 'VIEWING_SUGGESTION' });
        } else {
            response = MisunderstoodMessage();
        }

        return response;
    } catch (err) {
        /**
         * @todo
         * if occurs any at this point, must to be NOTHING
         * but, in the future, will be created a log system to log the errors
         * now, the only action here is to return a misunderstood message
         */
        return MisunderstoodMessage();
    }
}

module.exports = { HandleText, HandleQuickReply, HandlePostback };