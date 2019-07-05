const should = require('should'); // eslint-disable-line
const {
    WelcomeMessage, StartOverMessage, BooksListMessage, SuggestMessage, ErrorMessage, NotAcceptableMessage,
    MisunderstoodMessage, AskIdOrNameMessage, AdviceStartOverMessage, TipChoosingSearchMessage,
    TipChoosedBookMessage, TipChoosingBookMessage, TipSearchingByMessage, TipViewingSuggestionMessage
} = require('../../src/services/messageTemplates.service');

describe('Message Templates Service Test', () => {
    describe('Welcome Message', () => {
        it('Should be generated a Welcome message correctly', () => {
            const message = WelcomeMessage('Firstname');

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String().and.match(/Firstname/);

            message[1].should.have.property('text').and.be.a.String();

            message[1].should.have.property('quick_replies');
            message[1].quick_replies.should.be.a.Array();

            message[1].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[1].quick_replies[0].should.have.property('title');
            message[1].quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_BY_ID');

            message[1].quick_replies[1].should.have.property('content_type').and.be.equal('text');
            message[1].quick_replies[1].should.have.property('title');
            message[1].quick_replies[1].should.have.property('payload').and.be.equal('SEARCH_BY_NAME');
        });
    });

    describe('Start Over Message', () => {
        it('Should be generated a message correctly', () => {
            const message = StartOverMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();

            message[0].should.have.property('quick_replies');
            message[0].quick_replies.should.be.a.Array();

            message[0].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[0].should.have.property('title');
            message[0].quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_BY_ID');

            message[0].quick_replies[1].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[1].should.have.property('title');
            message[0].quick_replies[1].should.have.property('payload').and.be.equal('SEARCH_BY_NAME');
        });
    });

    describe('Books List Message', () => {
        it('Should be generated a Books List message with 5 items, all of them correctly', () => {
            const booksArray = [
                { id: '123', title: 'A book', subTitle: 'An author', imageUrl: 'http://url1.com' },
                { id: '456', title: '2 book', subTitle: 'Another author', imageUrl: 'http://url2.com' },
                { id: '789', title: '3 book', subTitle: 'Again author', imageUrl: 'http://url3.com' },
                { id: '012', title: '4 book', subTitle: 'Unknow author', imageUrl: 'http://url4.com' },
                { id: '345', title: '5 book', subTitle: 'None author', imageUrl: 'http://url5.com' }
            ];

            const message = BooksListMessage(booksArray);

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();

            message[1].should.have.property('attachment');
            message[1].attachment.should.be.have.property('payload');
            message[1].attachment.payload.should.be.have.property('template_type').and.be.equal('generic');
            message[1].attachment.payload.should.be.have.property('elements').and.be.a.Array();

            for (let i = 0, len = message[1].attachment.payload.elements.length; i < len; i++) {
                let item = message[1].attachment.payload.elements[i];
                item.should.have.property('title').and.be.equal(booksArray[i].title);
                item.should.have.property('subtitle').and.be.equal(booksArray[i].subTitle);
                item.should.have.property('image_url').and.be.equal(booksArray[i].imageUrl);
                item.should.have.property('buttons').and.be.a.Array();
                item.buttons[0].should.have.property('type').and.be.equal('postback');
                item.buttons[0].should.have.property('title').and.be.a.String();
                item.buttons[0].should.have.property('payload').and.be.equal(`CHOOSE_BOOK_${booksArray[i].id}`);
            }
        });
    });

    describe('Suggest Message', () => {
        it('Should be generated an affirmative Suggest message correctly', () => {
            const message = SuggestMessage('affirmative');

            message.should.have.property('text').and.be.a.String().and.match(/:\)/);
            message.should.have.property('quick_replies');
            message.quick_replies.should.be.a.Array();

            message.quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message.quick_replies[0].should.have.property('title');
            message.quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_ANOTHER');
        });
        it('Should be generated a negative Suggest message correctly', () => {
            const message = SuggestMessage('negative');

            message.should.have.property('text').and.be.a.String().and.match(/:\(/);
            message.should.have.property('quick_replies');
            message.quick_replies.should.be.a.Array();

            message.quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message.quick_replies[0].should.have.property('title');
            message.quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_ANOTHER');
        });
        it('Should be generated a non-conclusive Suggest message correctly', () => {
            const message = SuggestMessage('nonconclusive');

            message.should.have.property('text').and.be.a.String().and.match(/¯\\_\(ツ\)_\/¯/);
            message.should.have.property('quick_replies');
            message.quick_replies.should.be.a.Array();

            message.quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message.quick_replies[0].should.have.property('title');
            message.quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_ANOTHER');
        });
    });

    describe('Error Message', () => {
        it('Should be generated a Error message correctly', () => {
            const message = ErrorMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();

            message[1].should.have.property('text').and.be.a.String();
            message[1].should.have.property('quick_replies');
            message[1].quick_replies.should.be.a.Array();

            message[1].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[1].quick_replies[0].should.have.property('title');
            message[1].quick_replies[0].should.have.property('payload').and.be.equal('START_OVER');
        });
    });

    describe('Not Acceptable Message', () => {
        it('Should be generated a message correctly', () => {
            const message = NotAcceptableMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
        });
    });

    describe('Misunderstood Message', () => {
        it('Should be generated a message correctly', () => {
            const message = MisunderstoodMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();

            message[1].should.have.property('text').and.be.a.String();
            message[1].should.have.property('quick_replies');
            message[1].quick_replies.should.be.a.Array();

            message[1].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[1].quick_replies[0].should.have.property('title');
            message[1].quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_BY_ID');

            message[1].quick_replies[1].should.have.property('content_type').and.be.equal('text');
            message[1].quick_replies[1].should.have.property('title');
            message[1].quick_replies[1].should.have.property('payload').and.be.equal('SEARCH_BY_NAME');
        });
    });

    describe('Ask Id Or Name Message', () => {
        it('Should be generated a message correctly with \'id\' as parameter', () => {
            const message = AskIdOrNameMessage('id');

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String().and.match(/id/);
        });
        it('Should be generated a message correctly with \'name\' as parameter', () => {
            const message = AskIdOrNameMessage('name');

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String().and.match(/name/);
        });
    });

    describe('Advice Start Over Message', () => {
        it('Should be generated a message correctly', () => {
            const message = AdviceStartOverMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
            message[0].should.have.property('quick_replies');
            message[0].quick_replies.should.be.a.Array();

            message[0].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[0].should.have.property('title');
            message[0].quick_replies[0].should.have.property('payload').and.be.equal('START_OVER');
        });
    });

    describe('Tip Choosing Search Message', () => {
        it('Should be generated a message correctly', () => {
            const message = TipChoosingSearchMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
            message[0].should.have.property('quick_replies');
            message[0].quick_replies.should.be.a.Array();

            message[0].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[0].should.have.property('title');
            message[0].quick_replies[0].should.have.property('payload').and.be.equal('SEARCH_BY_ID');

            message[0].quick_replies[1].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[1].should.have.property('title');
            message[0].quick_replies[1].should.have.property('payload').and.be.equal('SEARCH_BY_NAME');
        });
    });

    describe('Tip Searching By Message', () => {
        it('Should be generated a message correctly', () => {
            const message = TipSearchingByMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
        });
    });

    describe('Tip Choosing Book Message', () => {
        it('Should be generated a message correctly', () => {
            const message = TipChoosingBookMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
        });
    });

    describe('Tip Choosed Book Message', () => {
        it('Should be generated a message correctly', () => {
            const message = TipChoosedBookMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
        });
    });

    describe('Tip Viewing Suggestion Message', () => {
        it('Should be generated a message correctly', () => {
            const message = TipViewingSuggestionMessage();

            message.should.be.a.Array();
            message[0].should.have.property('text').and.be.a.String();
            message[0].should.have.property('quick_replies');
            message[0].quick_replies.should.be.a.Array();

            message[0].quick_replies[0].should.have.property('content_type').and.be.equal('text');
            message[0].quick_replies[0].should.have.property('title');
            message[0].quick_replies[0].should.have.property('payload').and.be.equal('START_OVER');
        });
    });
});