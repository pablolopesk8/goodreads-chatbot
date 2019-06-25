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
                reviews: "notArray"
            });

            book.validate((err) => {
                err.errors.should.have.property('reviews');
                err.errors['reviews'].should.have.property('message').be.equal('reviews needs to be an array');
            });
        });

        it('Should be have a validation for shouldBuy is a boolean', () => {
            const book = new Books({
                goodreadsId: "123456asd",
                title: "any title of book",
                author: "Unknown Author",
                smallImage: "http://url.com",
                reviews: [],
                shouldBuy: "not boolean"
            });

            book.validate((err) => {
                err.errors.should.have.property('shouldBuy');
                err.errors['shouldBuy'].should.have.property('message').be.equal('shouldBuy needs to be a boolean');
            });
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
                shouldBuy: false,
                other: 123,
                anyOther: [1, 'a']
            });

            book.validate((err) => {
                should.not.exist(err);
            });
        });
    });
});