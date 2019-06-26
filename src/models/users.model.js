const mongoose = require('mongoose');
// this line is needed because an issue noticed in: https://github.com/Automattic/mongoose/issues/6890
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;
/**
 * Users model, created as a mongoose Schema
 * 
 * @todo validation for string type doesn't work
 *      It's needed a custom validator, that won't be created at this moment
 */
const usersModel = new Schema({
    messengerId: {
        type: String,
        required: [true, 'messengerId is required'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'firstName is required']
    },
    currentState: {
        type: String,
        enum: ["CHOOSING_TYPE_SEARCH", "SEARCHING_BY_ID", "SEARCHING_BY_TITLE", "CHOOSING_BOOK", "VIEWING BOOK", null]
    },
    booksShowed: [ String ]
});

module.exports = mongoose.model('Users', usersModel);