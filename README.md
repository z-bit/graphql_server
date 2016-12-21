# graphql_server
##following [egghead.io](https://egghead.io/lessons/javascript-create-a-graphql-schema)

* update node
* npm install -g yarn
* mkdir graphql_server
* cd grapql_server
* yarn init -y
* yarn add graphql


* yarn add express express-graphql  // needed from vid05 onwards

slight problems with vid12.js, commented on within

* yarn add graphql-relay // needed from vid13 onwards

##Final Thoughts
Course consisted of 15 videos:	
* vid01: Create a GraphQL Schema
* vid02: Use GraphQL Primitive Types
* vid03: Use GraphQL's Object Type for Basic Types
* vid04: Use GraphQL's List Type for Collections
* vid05: Serve a GraphQL Schema as Middleware in Express
* vid06: Write a GraphQL Schema in JavaScript
* vid07: Use Arguments in a GraphQL Query
* vid08: Use GraphQLNonNull for Required Fields
* vid09: Use GraphQLList with GraphQLObject Types
* vid10: Write a GraphQL Mutation
* vid11: Create an Input Object Type for Complex Mutations
* vid12: Add an Interface to a GraphQL Schema
* vid13: Add a Relay Node Interface to a GraphQL Schema
* vid14: Convert GraphQL List Type to a Relay Connection Type
* vid15: Use Relay’s Input Object Mutations

Though you could follow through all lessons easily, the nagging questions stays:

***Why did I do all this?***

Nobody sets up a GraphQL server to set up a GraphQL server!
####Unanswered is how to:
* save data persistently
* connect to surrounding databases
* access the GraphQL server from a client 