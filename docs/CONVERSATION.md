# Conversation Flow

1. User clicks on Start
    > POST: POSTBACK - GET_STARTED
2. Chatbot send welcome message and options for search a book
    > RESPONSE: WelcomeMessage and buttons SEARCH_BY_ID and SEARCH_BY_NAME  
    > USER STATE: CHOOSING_TYPE_SEARCH

    2.1. In case of START_OVER, the Welcome Message is not sent
3. User click in one of buttons for search
    > POST: QUICK_REPLY - SEARCH_BY_ID | SEARCH_BY_NAME  
4. In both cases, Chatbot send a message asking for Id or Name
    > RESPONSE: AskForIdOrName  
    > USER STATE: ASKING_FOR_ID | ASKING_FOR_NAME
5. User type an Id or Name
    > POST: TEXT - Id or Name of a book  
    > USER STATE: SEARCHING_BY_ID | SEARCHING_BY_NAME
6. Chatbot send a list with maximum 5 books to user
    > RESPONSE - BooksListMessage  
    > USER STATE: CHOOSING_BOOK
7. User choose on of the books
    > POST - POSTBACK - CHOOSE_BOOK_{bookId}  
    > USER STATE: CHOOSED_BOOK
8. Chatbot send for user the suggestion about to buy or not to buy the book and a button to start over the conversation
    > RESPONSE: SuggestMessage and button START_OVER
    > USER STATE - VIEWING_SUGGESTION
9. User click in Start Over button and is redirect to step 2
    > POST - QUICK_REPLY - START_OVER

## Exceptions

1. At any time, the user can type **start over** and will be redirect to setp 2
2. Will be accpeted text only in setp 5 (except the describe on item above). In other cases, the Chatbot will response with a MisunderstoodMessage
3. After three consecutives times that the Chatbot doesn't understand the user, will be sent a AdviceStartOverMessage with a button that redirect the user to the step 2
