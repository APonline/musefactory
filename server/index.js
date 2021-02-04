import typeDefs from './graphql-schema';
import resolvers from './API/resolvers';
import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { ApolloServer, gql }  from 'apollo-server-express';
import { makeAugmentedSchema } from 'neo4j-graphql-js';
import { v1 as neo4j } from 'neo4j-driver';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import dotenv from 'dotenv';
dotenv.config();

const pubsub = new PubSub();

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

const app = express();

app.use('/graphql', bodyParser.json());

const apolloServer = new ApolloServer({
    context: ({ req }) => {
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

        console.log(`GraphQL API ready at ${process.env.GRAPHQL_LISTEN_PORT}`);
    });

