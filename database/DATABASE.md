# Database

This file describe the configurations used in Mongo database creation.

## Docker

Docker is configured in docker-compose because isn't required special configurations.  
The service is started with auth configurations, to improve security.  
The exposed port is **3004**.  
Is set the [data/db](/data/db) to the container put the data manipulated into container for outside of the container, in the host machine, creating something like as data backup.  
Is set a script to run in the first initialization of docker. This script is responsible for the creaction of the database and collections. The script is in [mongo-init](mongo-init.js).

## Schema

The schema set the configuration of collection **users**. There are only one required property for user and enable additional properties.  
The complete definitions there are in [mongo-init](mongo-init.js).

## Dump and Restore

If it's necessary to make manual dump for database, you can run

```bash
mongodump -p 3004 -d goodreadsbot -c users -o <path_to_output_dump>
```

If it's necessary to make manual restore for database, you can run
```bash
mongorestore <path_where_database_dumped>
```

## Reference

The following docs was used as reference:  
[Validation Schema](https://www.mongodb.com/blog/post/mongodb-36-json-schema-validation-expressive-query-syntax)  
[Scripts for Database](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)  
[Mongo in Docker](https://hub.docker.com/_/mongo)
