const Ajv = require('ajv');
const ajv = new Ajv({ errorDataPath: 'property' });

/**
 * Validate the body received in handle message
 * @param {Object} data data to be validated
 * @throws {Error} error specifying if field required (required-field),
 *          invalid (type-field) or wrong pattern (pattern-field)
 * @returns {boolean} true
 */
const validator = async (data) => {
    // schema to validate user and tags
    const schema = {
        properties: {
            object: { type: "string", pattern: "^page$" },
            entries: { type: "array" }
        },
        required: ["object", "entries"]
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

module.exports = { handleMessagesBodyValidator: validator };