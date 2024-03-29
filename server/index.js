import typeDefs from './graphql-schema';
import resolvers from './API/resolvers';
import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { v1 as neo4j } from 'neo4j-driver';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const jwt = require('express-jwt');

import dotenv from 'dotenv';
dotenv.config();



// JWT 
const JWT_SECRET = process.env.JWT_SECRET;

const auth = jwt({
    secret: "ilikemusefactory",
    credentialsRequired: false,
    algorithms: ['RS256']
});
// JWT ENDS



// GRAPHQL NEO4J APOLLO
const schema = makeAugmentedSchema({
    typeDefs,
    resolvers
});
const driver = neo4j.driver(
    process.env.NEO4J_URI || `bolt://127.0.0.1:7687`,
    neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'neo4j'),
    { encrypted: "ENCRYPTION_OFF" }
);
// GRAPHQL NEO4J APOLLO ENDS



// APP SERVER
const app = express();

app.use('/graphql', bodyParser.json(), auth);

const apolloServer = new ApolloServer({
    context: async ({ req }) => {
        return {
            ...req,
            headers: req.headers,
            driver
        };
    },
    schema: schema,
    uploads: {
        maxFieldSize: 1000000000,
        maxFiles: 20,
    }
});
apolloServer.applyMiddleware({ app });
const server = createServer(app);
server.listen(process.env.GRAPHQL_LISTEN_PORT, `0.0.0.0`, () => {
    new SubscriptionServer({
        execute,
        subscribe,
        schema,
    }, {
        server: server,
        path: '/subscriptions',
    });

    console.log(`GraphQL API ready at` + JSON.stringify(server.address()) + `${process.env.GRAPHQL_LISTEN_PORT}`);
});
// APP SERVER ENDS



