/**
 * Service to provide methods to connect and disconnect from database
 */
// Get config variables
const config = require('../config');

// Get mongoose
const mongoose = require('mongoose');

// method to connect in a database
const DBConnect = async () => {
    const con = await mongoose.connect(`mongodb://${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`, {
        auth: { user: config.mongodbUser, password: config.mongodbPass },
        useNewUrlParser: true
    });
    //console.log(`Connected to mongodb with: ${config.mongodbHost}:${config.mongodbPort}/${config.mongodbDatabase}`);
    return con;
};

const DBCloseConnection = async () => {
    //console.log(`Closed connection to mongodb: ${mongoHost}:${mongoPort}/${mongoDatabase}`);
    return await mongoose.disconnect();
}

module.exports = { DBConnect: DBConnect, DBCloseConnection: DBCloseConnection };