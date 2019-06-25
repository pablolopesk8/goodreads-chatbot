const mongoose = require('mongoose');
// this line is needed because an issue noticed in: https://github.com/Automattic/mongoose/issues/6890
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;
/**
 * Books model, created as a mongoose Schema
 * 
 * @todo validation for string type doesn't work
 *      It's needed a custom validator, that won't be created at this moment
 */
const booksModel = new Schema({

});

module.exports = mongoose.model('Books', booksModel);