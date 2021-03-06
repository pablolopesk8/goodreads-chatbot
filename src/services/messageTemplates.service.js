/**
 * Service to create templates for all messages of chatbot
 */
const i18n = require('../i18n.config');

/**
 * Template with two messages: one text and 2 quick replies
 * @param {String} userName
 * @return {Array} template generated
 */
const WelcomeMessage = (userName) => {
    const template = [
        {
            text: i18n.__("getStarted.textWelcome", { userFirstName: userName })
        },
        {
            text: i18n.__("getStarted.textQuestionTypeSearch"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchById"),
                    payload: "SEARCH_BY_ID"
                },
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchByName"),
                    payload: "SEARCH_BY_NAME"
                }
            ]
        }
    ];

    return template;
};

/**
 * Template for a message similar to Welcome, but without the welcome text
 * @returns {Array} template generated
 */
const StartOverMessage = () => {
    const template = [
        {
            text: i18n.__("getStarted.textQuestionTypeSearch"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchById"),
                    payload: "SEARCH_BY_ID"
                },
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchByName"),
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
            text: i18n.__("booksList.textInitial")
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
                title: i18n.__("booksList.buttonChooseBook"),
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
        suggestText = i18n.__("suggestBook.textAffirmative");
    } else if (suggestType === "negative") {
        suggestText = i18n.__("suggestBook.textNegative");
    } else {
        suggestText = i18n.__("suggestBook.textNonconclusive");
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

/**
 * Template for generic error message
 * @return {Object} template generated
 */
const ErrorMessage = () => {
    const template = [
        {
            text: i18n.__("errorMessage.textDefault")
        },
        {
            text: i18n.__("errorMessage.textStartover"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.startOver"),
                    payload: "START_OVER"
                }
            ]
        }
    ];

    return template;
}

/**
 * Template for default not acceptable message
 * @return {Object} template generated
 */
const NotAcceptableMessage = () => {
    const template = [ { text: i18n.__("notAcceptable.text") } ];
    return template;
}

/**
 * Template for default misunderstood message, with suggestions
 * @return {Object} template generated
 */
const MisunderstoodMessage = () => {
    const template = [
        {
            text: i18n.__("misunderstood.textGeneral")
        },
        {
            text: i18n.__("misunderstood.textLetsTry"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchById"),
                    payload: "SEARCH_BY_ID"
                },
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchByName"),
                    payload: "SEARCH_BY_NAME"
                }
            ]
        }
    ];

    return template;
}

/**
 * Template for a simple message, asking for id or name
 * @param {String} askFor what is needed ask for
 * @returns {Array} template generated
 */
const AskIdOrNameMessage = (askFor) => {
    let template;
    if (askFor === 'name') {
        template = [ { text: i18n.__("askIdOrName.textName") } ];
    } else {
        template = [ { text: i18n.__("askIdOrName.textId") } ];
    }
    return template;
}

/**
 * Template for a message giving an advice start over, normally after many misunderstoods
 * @returns {Array} template generated
 */
const AdviceStartOverMessage = () => {
    const template = [
        {
            text: i18n.__("adviceStartOver.text"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.startOver"),
                    payload: "START_OVER"
                }
            ]
        }
    ];

    return template;
}

/**
 * Template whith a tip when user is in Choosing Search state
 * @returns {Array} template generated
 */
const TipChoosingSearchMessage = () => {
    const template = [
        {
            text: i18n.__("tipChoosingSearch.text"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchById"),
                    payload: "SEARCH_BY_ID"
                },
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.searchByName"),
                    payload: "SEARCH_BY_NAME"
                }
            ]
        }
    ];

    return template;
}

/**
 * Template whith a tip when user is in Searching By anything state
 * @returns {Array} template generated
 */
const TipSearchingByMessage = () => {
    return [ { text: i18n.__("tipSearchingBy.text") } ];
}

/**
 * Template whith a tip when user is in Choosing Book state
 * @returns {Array} template generated
 */
const TipChoosingBookMessage = () => {
    return [ { text: i18n.__("tipChoosingBook.text") } ];
}

/**
 * Template whith a tip when user is in Choosed Book state
 * @returns {Array} template generated
 */
const TipChoosedBookMessage = () => {
    return [ { text: i18n.__("tipChoosedBook.text") } ];
}

/**
 * Template whith a tip when user is in Viewing Suggestion state
 * @returns {Array} template generated
 */
const TipViewingSuggestionMessage = () => {
    const template = [
        {
            text: i18n.__("tipViewingSuggestion.text"),
            quick_replies: [
                {
                    content_type: "text",
                    title: i18n.__("buttonsDefault.startOver"),
                    payload: "START_OVER"
                }
            ]
        }
    ];

    return template;
}

module.exports = {
    WelcomeMessage, StartOverMessage, BooksListMessage, SuggestMessage, ErrorMessage, NotAcceptableMessage, MisunderstoodMessage, AskIdOrNameMessage,
    TipViewingSuggestionMessage, AdviceStartOverMessage, TipChoosingSearchMessage, TipSearchingByMessage, TipChoosingBookMessage, TipChoosedBookMessage
};