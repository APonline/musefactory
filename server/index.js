import typeDefs from './graphql-schema';
import resolvers from './resolvers';
import { ApolloServer } from 'apollo-server';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { v1 as neo4j } from 'neo4j-driver';

import dotenv from 'dotenv';
dotenv.config();

const schema = makeAugmentedSchema({
    typeDefs,
    resolvers
});

const driver = neo4j.driver(
    process.env.NEO4J_URI || `bolt://127.0.0.1:7687`,
    neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j', 
        process.env.NEO4J_PASSWORD || 'neo4j'),
    { encrypted: "ENCRYPTION_OFF"}
);

const server = new ApolloServer({
    context: { driver },
    schema: schema,
    uploads: {
        maxFieldSize: 1000000000,
        maxFiles: 20,
    }
});

server.listen(process.env.GRAPHQL_LISTEN_PORT, `0.0.0.0`).then(({ url }) => {
    console.log(`GraphQL API ready at ${url}`)
});
