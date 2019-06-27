/**
 * Service to create templates for all messages of chatbot
 */
const config = require('../config');
const i18n = require('../i18n.config');

/**
 * Template with two messages: one text and 2 quick replies
 * @param {String} userName
 * @return {Array} template generated
 */
const WelcomeMessage = (userName) => {
    const template = [
        {
            text: i18n.__("getStarted.welcome", { userFirstName: userName })
        },
        {
            text: i18n.__("getStarted.questionTypeSearch"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("getStarted.buttonSearchId"),
                    payload: "SEARCH_BY_ID"
                },
                {
                    content_type: "text",
                    title: i18n.__("getStarted.buttonSearchName"),
                    payload: "SEARCH_BY_NAME"
                }
            ]
        }
    ];

    return template;
};

/**
 * Template with a text message and a list of books, generated using image and button
 * @param {Array | Object} booksList
 * @return {Array} template generated
 */
const BooksListMessage = (booksList) => {
    const template = [
        {
            text: i18n.__("booksList.initial")
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: []
                }
            }
        }
    ];

    for (let book of booksList) {
        template[1].attachment.payload.elements.push({
            title: book.title,
            subtitle: book.subTitle,
            image_url: book.imageUrl,
            buttons: [{
                type: 'postback',
                title: i18n.__("booksList.buttonChooseThis"),
                payload: `CHOOSE_BOOK_${book.id}`
            }]
        });
    }

    return template;
};

/**
 * Template with one quick reply with the suggestion about the book
 * @param {String} suggestType type of suggestion to be generated
 * @return {Object} template generated
 */
const SuggestMessage = (suggestType = 'nonconclusive') => {
    let suggestText;
    if (suggestType === "affirmative") {
        suggestText = i18n.__("suggestBook.affirmative");
    } else if (suggestType === "negative") {
        suggestText = i18n.__("suggestBook.negative");
    } else {
        suggestText = i18n.__("suggestBook.nonconclusive");
    }

    const template = {
        text: suggestText,
        quick_replies: [{
            content_type: "text",
            title: i18n.__("suggestBook.buttonSearchAnother"),
            payload: "SEARCH_ANOTHER"
        }]
    };

    return template;
}

module.exports = { WelcomeMessage, BooksListMessage, SuggestMessage };