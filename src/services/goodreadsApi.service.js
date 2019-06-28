/**
 * Service to provide an integration with Goodreads API
 */
const request = require('request-promise-native');
const xmlJs = require("xml-js");
const config = require("../config");
const HTMLParser = require('node-html-parser');

/**
 * Get a book on goodreads API, using the goodreads id
 * @param {String} goodreadsId 
 * @returns {Object} book found | empty
 * @throws {Error} goodreadsId-required | goodreadsapi-generic
 */
const GetBookById = async (goodreadsId) => {
    // goodreadsId is required
    if (!goodreadsId) {
        throw new Error("goodreadsId-required");
    }

    const options = {
        uri: `${config.goodreadsSearchBookByIdUrl}/${goodreadsId}.json`,
        qs: { key: config.goodreadsKey },
        method: "GET"
    };

    try {
        const bookXml = await request(options);
        const bookJson = JSON.parse(xmlJs.xml2json(bookXml, { compact: true, spaces: 4 }));

        // get the reviews widget of book to get, into that, the isbn of the book
        const bookReviewsWidget = bookJson.GoodreadsResponse.book.reviews_widget._cdata;
        const isbn = bookReviewsWidget.substring(bookReviewsWidget.indexOf("isbn=") + 5, bookReviewsWidget.indexOf("&amp;links"));

        // to create the book object to return, is needed verify if title has text or cdata and if author is an array
        return {
            goodreadsId: goodreadsId,
            title: bookJson.GoodreadsResponse.book.title._cdata || bookJson.GoodreadsResponse.book.title._text,
            author: Array.isArray(bookJson.GoodreadsResponse.book.authors.author)
                ? bookJson.GoodreadsResponse.book.authors.author[0].name._text
                : bookJson.GoodreadsResponse.book.authors.author.name._text,
            smallImage: bookJson.GoodreadsResponse.book.small_image_url._text,
            isbn: isbn
        };
    } catch (err) {
        switch (err.statusCode) {
            case 404:
                return {};
            default:
                throw new Error("goodreadsapi-generic");
        }
    }
}

/**
 * Get a list of books (delimited by numOfBooks) on Goodreads API using a title
 * @param {String} bookTitle 
 * @param {Number} numOfBooks number of books have be returned. Default 5
 * @returns {Array} array of books found
 * @throws {Error} title-required | goodreadsapi-generic
 */
const GetBooksByTitle = async (bookTitle, numOfBooks = 5) => {
    // bookTitle is required
    if (!bookTitle) {
        throw new Error("title-required");
    }

    const options = {
        uri: config.goodreadsSearchBooksByTitleUrl,
        qs: { key: config.goodreadsKey, q: bookTitle },
        method: "GET"
    };

    try {
        const booksXml = await request(options);
        const booksJson = JSON.parse(xmlJs.xml2json(booksXml, { compact: true, spaces: 4 }));

        // if there are only one result of book, get info about this book
        // if there are more than one result of book, get info about all books
        const booksArray = [];
        if (booksJson.GoodreadsResponse.search['total-results']._text == 1) {
            let book = await GetBookById(booksJson.GoodreadsResponse.search.results.work.best_book.id._text);
            booksArray.push(book);
        } else if (booksJson.GoodreadsResponse.search['total-results']._text > 0) {
            const booksLength = booksJson.GoodreadsResponse.search['total-results']._text;
            for (let i = 0; i < numOfBooks && i < booksLength; i++) {
                let book = await GetBookById(booksJson.GoodreadsResponse.search.results.work[i].best_book.id._text);
                booksArray.push(book);
            }
        }

        return booksArray;
    } catch (err) {
        // goodreads API doesn't return type of error, so, the error is handled as generic
        throw new Error("goodreadsapi-generic");
    }
}

/**
 * Get reviews about a book, setting the num of reviews
 * @param {Stirng} isbn 
 * @param {Number} maxReviews number to limit the number of reviews
 * @returns {Array} array of reviews found
 * @throws {Error} isbn-required | goodreadsapi-generic
 */
const GetReviewsByISBN = async (isbn, maxReviews = 10) => {
    // isbn is required
    if (!isbn) {
        throw new Error("isbn-required");
    }

    // set min_rating = 1 (minimun grade that a person needs to put for the book for consider your review)
    // set text = 50 (number of characters returned for each review)
    // set num_reviews with parameter (number of reviews to get in API)
    const options = {
        uri: `${config.goodreadsGetReviewByIsbnUrl}`,
        qs: { isbn: isbn, min_rating: 1, text: 500, num_reviews: maxReviews },
        method: "GET"
    };

    try {
        const reviewsHTML = await request(options);
        const reviewsJson = HTMLParser.parse(reviewsHTML);

        // get the reviews tag
        const reviewsTag = reviewsJson.querySelectorAll('.gr_review_text');

        let reivewsArray = [];
        for (let i = 0, len = reviewsTag.length; i < maxReviews && i < len; i++) {
            reivewsArray.push(reviewsTag[i].rawText.trim());
        }

        return reivewsArray;
    } catch (err) {
        // goodreads API doesn't return type of error, so, the error is handled as generic
        throw new Error("goodreadsapi-generic");
    }
}

module.exports = { GetBookById, GetBooksByTitle, GetReviewsByISBN };