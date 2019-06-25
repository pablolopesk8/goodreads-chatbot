/* eslint-disable */
/** Init file to create user, database and schema**/
db.auth("admin", "123@Abc");

db.createUser(
    {
        user: "admin_goodreadsbot",
        pwd: "Xyz@789",
        roles: [{ role: "readWrite", db: "goodreadsbot" }]
    }
);

/** create users collection with a schema validator **/
/* db.runCommand( {
    collMod: "users", */
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["messengerId", "firstName", "currentState"],
            additionalProperties: true,
            properties: {
                messengerId: {
                    bsonType: "string",
                    description: "string required"
                },
                firstName: {
                    bsonType: "string",
                    description: "string required"
                },
                currentState: {
                    enum: ["CHOOSING_TYPE_SEARCH", "SEARCHING_BY_ID", "SEARCHING_BY_TITLE", "CHOOSING_BOOK", "VIEWING BOOK", null],
                    description: "string required"
                }
            }
        }
    }
});

db.createCollection("books", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["goodreadsId", "title", "author", "smallImage"],
            additionalProperties: true,
            properties: {
                goodreadsId: {
                    bsonType: "string",
                    description: "string required"
                },
                title: {
                    bsonType: "string",
                    description: "string required"
                },
                author: {
                    bsonType: "string",
                    description: "string required"
                },
                smallImage: {
                    bsonType: "string",
                    description: "string required"
                },
                isbn: {
                    bsonType: ["string", "null"],
                    description: "string not required"
                },
                reviews: {
                    bsonType: "array",
                    description: "array of the book's reviews. not required",
                    minItems: 0,
                    items: {
                        bsonType: "string"
                    }
                },
                shouldBy: {
                    enum: [true, false],
                    description: "information if user should by or not. not required"
                }
            }
        }
    }
});