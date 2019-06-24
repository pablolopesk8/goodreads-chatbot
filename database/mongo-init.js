/** Init file to create user, database and schema**/
conn = new Mongo();
db = conn.getDB("goodreadsbot");

db.createUser(
    {
        user: "admin_goodreadsbot",
        pwd: "Xyz@789",
        roles: [{ role: "readWrite", db: "goodreadsbot" }]
    }
);

/** create users collection with a schema validator **/
/* db.runCommand( {
    collMod: "contacts", */
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["facebookId"],
            additionalProperties: true,
            properties: {
                facebookId: {
                    bsonType: "string",
                    description: "string required"
                }
            }
        }
    }
});
