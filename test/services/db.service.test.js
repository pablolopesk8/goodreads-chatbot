const should = require('should'); // eslint-disable-line
const mongoose = require('mongoose');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');

describe('Database Service Test', () => {
    describe('When connected correctly', () => {
        it('Should be an instance of Mongoose', async () => {
            return DBConnect().then(
                (ret) => {
                    ret.should.be.equal(mongoose);
                    DBCloseConnection();
                }
            );
        });
    });
});