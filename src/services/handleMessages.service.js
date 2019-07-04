/**
 * Services to manipulate messages and to define what is the answer
 */
const {
    WelcomeMessage, BooksListMessage, SuggestMessage, MisunderstoodMessage, StartOverMessage, AdviceStartOverMessage, AskIdOrNameMessage
} = require('./messageTemplates.service');
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
 * @returns {HandlePayload|MessageTemplate}
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

/**
 * Handle all quick replies received and redirect to HandlePayload
 * @param {Object|MongooseSchema} user 
 * @param {Object|WebhookEvent} postback 
 * @returns {HandlePayload|MessageTemplate}
 */
const HandleQuickReply = async (user, quickReply) => {
    // Get the payload of the quick reply
    return HandlePayload(user, quickReply.payload);
}

const HandlePayload = async (user, payload) => {
    let response;

    try {
        // manipulate message, user and books according the payload
        if (payload === 'GET_STARTED') {
            user.currentState = 'CHOOSING_TYPE_SEARCH';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_TYPE_SEARCH' });
            response = WelcomeMessage(user.firstName);
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
        }// payload START_OVER
        else if (payload === 'START_OVER') {
            user.currentState = 'CHOOSING_TYPE_SEARCH';
            await Users.findByIdAndUpdate(user._id, { currentState: 'CHOOSING_TYPE_SEARCH' });
            response = StartOverMessage();
        }// payload SEARCH_BY_{ID_OR_NAME}
        else if (payload.indexOf('SEARCH_BY_') === 0) {
            const searchFor = payload.substring(payload.indexOf('SEARCH_BY_') + 10);

            // validate if it's a valid option
            if (['NAME','ID'].includes(searchFor)) {
                user.currentState = `ASKING_FOR_${searchFor}`;
                await Users.findByIdAndUpdate(user._id, { currentState: `ASKING_FOR_${searchFor}` });
                response = AskIdOrNameMessage(searchFor.toLowerCase());
            } else {
                // if it's a invalid option, get the misunderstood message
                response = GetMisunderstoodMessage(user);
            }
        } else {
            // if none options accepted, get the misunderstood
            response = GetMisunderstoodMessage(user);
        }

        return response;
    } catch (err) {
        /**
         * @todo
         * if occurs any at this point, must to be NOTHING
         * but, in the future, will be created a log system to log the errors
         * now, the action here return a misunderstood message
         */
        return GetMisunderstoodMessage(user);
    }
}

/**
 * Internal method to verify if must return an advice or a misunderstood
 * @param {Object|MongooseSchema} user 
 */
const GetMisunderstoodMessage = async (user) => {
    const times = user.timesNotUnderstand ? user.timesNotUnderstand : 0;
    if (times >= 3) {
        await Users.findByIdAndUpdate(user._id, { timesNotUnderstand: 0 });
        return AdviceStartOverMessage();
    } else {
        await Users.findByIdAndUpdate(user._id, { timesNotUnderstand: times + 1 });
        return MisunderstoodMessage();
    }
}

module.exports = { HandleText, HandleQuickReply, HandlePostback };