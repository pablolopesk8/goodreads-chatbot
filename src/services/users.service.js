/**
 * Service to provide operations with users
 */
const request = require('request-promise-native');
const config = require("../config");
const { GetBasicUserProfile } = require('./graphApi.service');
const Users = require('../models/users.model');

/**
 * Get user from local database, getting before on Facebook Graph API
 * @param {String} messengerId 
 * @return {Objec} user inserted | updated
 * @throws get error from related services and send up
 */
const GetUserLocal = async (messengerId) => {
    try {
        // get user profile from Graph and try to get them on local database
        const userProfile = await GetBasicUserProfile(messengerId);
        let user = await Users.findOne({ messengerId: userProfile.id });

        // if user doesn't exists in local, insert. If exists, update
        if (!user) {
            const user = await Users.create({ messengerId: userProfile.id, firstName: userProfile.firstName });
            return user.toJSON();
        } else {
            await Users.updateOne({ messengerId: user.messengerId }, { $set: { firstName: userProfile.firstName } });
            return user.toJSON();
        }
    } catch(err) {
        // doesn't handle the error. Only send up
        throw new Error(err.message);
    }
}

module.exports = { GetUserLocal };