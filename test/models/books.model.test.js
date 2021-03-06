const should = require('should'); // eslint-disable-line
const Books = require('../../src/models/books.model');


describe('Model Books Test', () => {
    describe('Model validation tests', () => {
        it('Should be have a validation for goodreadsId required', () => {
            const book = new Books({});

            book.validate((err) => {
                err.errors.should.have.property('goodreadsId');
                err.errors['goodreadsId'].should.have.property('message').be.equal('goodreadsId is required');
            });
        });

        it('Should be have a validation for title required', () => {
            const book = new Books({ goodreadsId: "123456asd" });

            book.validate((err) => {
                err.errors.should.have.property('title');
                err.errors['title'].should.have.property('message').be.equal('title is required');
            });
        });

        it('Should be have a validation for author required', () => {
            const book = new Books({ goodreadsId: "123456asd", title: "any title of book" });

            book.validate((err) => {
                err.errors.should.have.property('author');
                err.errors['author'].should.have.property('message').be.equal('author is required');
            });
        });

        it('Should be have a validation for smallImage required', () => {
            const book = new Books({ goodreadsId: "123456asd", title: "any title of book", author: "Unknown Author" });

            book.validate((err) => {
                err.errors.should.have.property('smallImage');
                err.errors['smallImage'].should.have.property('message').be.equal('smallImage is required');
            });
        });

        it('Should be have a validation for reviews is an array', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com",
                reviews: {}
            });

            book.validate((err) => {
                err.errors.should.have.property('reviews');
                err.errors['reviews'].should.have.property('message').be.equal('Cast to Array failed for value "{}" at path "reviews"');
            });
        });

        it('Should be have a validation for shouldBuy is an item for enum list', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com",
                reviews: [],
                shouldBuy: "yes"
            });

            book.validate((err) => {
                err.errors.should.have.property('shouldBuy');
                err.errors['shouldBuy'].should.have.property('message')
                    .be.equal('`yes` is not a valid enum value for path `shouldBuy`.');
            });
        });

        it('Should be have a validation for goodreadsId not unique', () => {
            /**
             * @todo
             * doesn't exists a validation for an unique field on mongoose, natively
             * so, I need to construct this validation manually in the future
             * and when it's constructed, I need insert data manually in database before of validation
             */
            /* const book = new Books({
                goodreadsId: "27765527",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com"
            });

            book.validate((err) => {
                err.errors.should.have.property('goodreadsId');
                err.errors['goodreadsId'].should.have.property('message').be.equal('Cast to Boolean failed for value "not boolean" at path "shouldBuy"');
            }); */
        });

        it('Should be created only with goodreadsId, title, author and smallImage', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com"
            });

            book.validate((err) => {
                should.not.exist(err);
            });
        });

        it('Should be created with goodreadsId, title, author, smallImage and any other properties', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com",
                other: 123,
                anyOther: [1, 'a']
            });

            book.validate((err) => {
                should.not.exist(err);
            });
        });

        it('Should be created with goodreadsId, title, author, smallImage, isbn, reviews, shouldBuy and any other properties', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com",
                isbn: "987qwer",
                reviews: [],
                shouldBuy: 'NO',
                other: 123,
                anyOther: [1, 'a']
            });

            book.validate((err) => {
                should.not.exist(err);
            });
        });
    });
});