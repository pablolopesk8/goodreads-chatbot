const Ajv = require('ajv');
const ajv = new Ajv({ errorDataPath: 'property' });

/**
 * Validate the data used in verify token
 * @param {Object} data data to be validated
 * @throws {Error} error specifying if field required (required-field) or invalid (type-field)
 * @returns {boolean} true
 */
const validator = async (data) => {
    // schema to validate user and tags
    const schema = {
        properties: {
            mode: { type: "string" },
            token: { type: "string" },
            challenge: { type: "string" }
        },
        required: ["mode", "token", "challenge"]
    }

    // get he result of validation
    const valid = await ajv.validate(schema, data);

    // if data is not valid, set the correct message to return
    if (!valid) {
        // set the error type according keyword and dataPath
        const errorType = `${ajv.errors[0].keyword}-${ajv.errors[0].dataPath.substr(1)}`;

        // throw an error with defined type
        throw new Error(errorType);
    } else {
        // if valid, return true
        return true;
    }
}

module.exports = { verifyTokenQuery: validator };