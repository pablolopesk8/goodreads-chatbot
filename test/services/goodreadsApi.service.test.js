const should = require('should'); // eslint-disable-line
const { GetBookById, GetBooksByTitle, GetReviewsByISBN } = require('../../src/services/goodreadsApi.service');

describe('GoodreadsApi Service Test', () => {
    describe('Get a Book using the Goodreads ID', () => {
        it('Should be able to get a book passing a valid ID', async () => {
            const books = await GetBookById("27598494");

            books.should.have.property('goodreadsId').and.be.a.String().and.be.equal("27598494");
            books.should.have.property('title').and.be.a.String();
            books.should.have.property('author').and.be.a.String();
            books.should.have.property('smallImage').and.be.a.String();
            books.should.have.property('isbn').and.be.a.String();

        });
        it('Should be able to get 0 books passing an inexistent ID', async () => {
            const books = await GetBookById("12345678900");

            books.should.be.a.Object().be.empty();
        });
        it('Should give an error if doesnt pass an ID', async () => {
            try {
                await GetBookById();
            } catch (err) {
                err.message.should.be.equal('goodreadsId-required');
            }
        });
    });

    describe('Get Books using the title', () => {
        it('Should be able to get 5 books passing a generic title', async () => {
            const books = await GetBooksByTitle("elon musk");

            books.should.be.a.Array().and.have.length(5);
            books.should.matchEach((item) => {
                item.should.have.property('goodreadsId').and.be.a.String();
                item.should.have.property('title').and.be.a.String().and.match(/elon musk/gmi);
                item.should.have.property('author').and.be.a.String();
                item.should.have.property('smallImage').and.be.a.String();
                item.should.have.property('isbn').and.be.a.String();
            });
        });
        it('Should be able to get 1 book passing a specific title', async () => {
            const books = await GetBooksByTitle("About the Serious Message of the Play Auto Da Compadecida");

            books.should.be.a.Array().and.have.length(1);
            books[0].should.have.property('goodreadsId').and.be.a.String();
            books[0].should.have.property('title').and.be.a.String().and.match(/About the Serious Message of the Play Auto Da Compadecida/gmi);
            books[0].should.have.property('author').and.be.a.String();
            books[0].should.have.property('smallImage').and.be.a.String();
            books[0].should.have.property('isbn').and.be.a.String();
        });
        it('Should be able to get 0 books passing an inexistent title', async () => {
            const books = await GetBooksByTitle("asdfasdf123");

            books.should.be.a.Array().and.have.length(0);
        });
        it('Should give an error if doesnt pass a title', async () => {
            try {
                await GetBooksByTitle();
            } catch (err) {
                err.message.should.be.equal('title-required');
            }
        });
    });

    describe('Get Reviews using ISBN', () => {
        it('Should be able to get reviews passing a valid ISBN', async () => {
            const reviews = await GetReviewsByISBN("0553588486");

            reviews.should.be.a.Array().and.be.not.empty();
            reviews.should.matchEach((item) => {
                item.should.be.a.String();
            });
        });
        it('Should be able to get 0 reviews passing an inexistent ISBN', async () => {
            const reviews = await GetReviewsByISBN("1");

            reviews.should.be.a.Array().and.be.empty();
        });
        it('Should give an error if doesnt pass an ISBN', async () => {
            try {
                await GetReviewsByISBN();
            } catch (err) {
                err.message.should.be.equal('isbn-required');
            }
        });
    });
});