const should = require('should'); // eslint-disable-line
const { GetUserLocal } = require('../../src/services/users.service');
const Users = require('../../src/models/users.model');
const { DBConnect, DBCloseConnection } = require('../../src/services/db.service');

// variable to be used in tests
const validMessengerId = '1644224095634421';
const invalidMessengerId = '1234567890123456';

describe('Users Service Test', () => {
    // force open and close connection with DB, because it's necessary to execution of this test
    before(async () => {
        await DBConnect();
    });
    after(async () => {
        await DBCloseConnection();
    });
    describe('Get User Local', () => {
        it('Should be able to get user data with a valid facebook user id not previously saved', async () => {
            const user = await GetUserLocal(validMessengerId);
            user.should.have.property('messengerId').and.be.equal(validMessengerId);
            user.should.have.property('firstName');
        });
        it('Should be able to get user data with a valid facebook user id previously saved', async () => {
            const user = await GetUserLocal(validMessengerId);
            user.should.have.property('messengerId').and.be.equal(validMessengerId);
            user.should.have.property('firstName');
        });
        it('Should give an error when passing a invalid facebook user id', async () => {
            try {
                await GetUserLocal(invalidMessengerId);
            } catch (err) {
                err.message.should.be.equal('invalid-facebookUserId');
            }
        })
        after(async () => {
            await Users.deleteMany({ messengerId: validMessengerId });
        });
    });
});