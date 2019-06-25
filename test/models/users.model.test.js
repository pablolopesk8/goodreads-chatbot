const should = require('should'); // eslint-disable-line
const Users = require('../../src/models/users.model');

describe('Model User Test', () => {
    describe('Model validation tests', () => {
        it('Should be have a validation for messengerId required', () => {
            const user = new Users({});

            user.validate((err) => {
                err.errors.should.have.property('messengerId');
                err.errors['messengerId'].should.have.property('message').be.equal('messengerId is required');
            });
        });

        it('Should be have a validation for firstName required', () => {
            const user = new Users({ messengerId: "123456asd" });

            user.validate((err) => {
                err.errors.should.have.property('firstName');
                err.errors['firstName'].should.have.property('message').be.equal('firstName is required');
            });
        });

        it('Should be have a validation for currentState is an item for enum list', () => {
            const user = new Users({ messengerId: "123456asd", firstName: "name", currentState: "wrong" });

            user.validate((err) => {
                err.errors.should.have.property('currentState');
                err.errors['currentState'].should.have.property('message').be.equal('currentState needs to be an valid item');
            });
        });

        it('Should be have a validation for booksShowed is an array', () => {
            const user = new Users({ messengerId: "123456asd", firstName: "name", currentState: "wrong", booksShowed: "notArray" });

            user.validate((err) => {
                err.errors.should.have.property('booksShowed');
                err.errors['booksShowed'].should.have.property('message').be.equal('booksShowed needs to be an array');
            });
        });

        it('Should be created only with messengerId and firstName', () => {
            const user = new Users({ messengerId: "123456asd", firstName: "name" });

            user.validate((err) => {
                should.not.exist(err);
            });
        });

        it('Should be created with messengerId, firstName and any other properties', () => {
            const user = new Users({
                messengerId: "123456asd",
                firstName: "name",
                other: 123,
                anyOther: [1, 'a']
            });

            user.validate((err) => {
                should.not.exist(err);
            });
        });

        it('Should be created with messengerId, firstName, currentState, booksShowed and any other properties', () => {
            const user = new Users({
                messengerId: "123456asd",
                firstName: "name",
                currentState: "CHOOSING_TYPE_SEARCH",
                booksShowed: [],
                other: 123,
                anyOther: [1, 'a']
            });

            user.validate((err) => {
                should.not.exist(err);
            });
        });
    });
});