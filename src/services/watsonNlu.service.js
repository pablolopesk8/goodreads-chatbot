/**
 * Service to provide an integration with Goodreads API
 */
const config = require("../config");
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const nlu = new NaturalLanguageUnderstandingV1({ version: config.watsonApiVersion, iam_apikey: config.watsonNluKey });


const GetEmotion = async (text) => {
    // text is required
    if (!text) {
        throw new Error("text-required");
    }

    try {
        // if sent an array, join that
        if (Array.isArray(text)) {
            text = text.join(' ');
        }

        const emotionResult = await nlu.analyze({
            text: text, features: { emotion: {} }
        });

        return verifyEmotion(emotionResult.emotion.document.emotion);
    } catch (err) {
        switch(err.code) {
            case 400:
                throw new Error("unsupported-language");
            case 422:
                throw new Error("short-text");
            default:
                throw new Error("generic-watsonnlu");
        }
    }
}

/**
 * Verify the emotion of emotion object got on Watson NLU
 * The logic is verify what emotions are more accurate than the minimun value accpetable
 * Using that emotions, set what is the correct emotion 
 * @param {*} emotionObject 
 * @param {*} minAcceptable 
 * @returns joy if one of them is joy |
 *          sadnes if no one of them is joy |
 *          doubt if no one emotions passing in accurancy validation
 *          the emotion if only one emotion passing in accurancy validation
 */
const verifyEmotion = (emotionObject, minAcceptable = 0.40) => {
    // get the items greather than min acceptable
    const acceptArray = [];
    for (let key in emotionObject) {
        if (emotionObject[key] >= minAcceptable) {
            acceptArray.push(key);
        }
    }

    // if there are no items on array, return doubt
    if (acceptArray.length <= 0) {
        return "doubt";
    }// if there are only one item on array, return them
    else if (acceptArray.length === 1) {
        return acceptArray[0];
    } else {
        // if there more than one AND one of them is joy, return joy
        if (acceptArray.indexOf('joy') >= 0) {
            return "joy";
        } else {
            // if there are not joy in array, return sadness
            return "sadness";
        }
    }
}

module.exports = { GetEmotion };