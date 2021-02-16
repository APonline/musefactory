import user from './user';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { createWriteStream } from 'fs';
import bcrypt from 'bcrypt';
const jsonwebtoken = require('jsonwebtoken');
import { neo4jgraphql } from "neo4j-graphql-js";
import "regenerator-runtime/runtime.js";
import { PubSub } from 'graphql-subscriptions';
import sendMailOut from '../../mailserver';

export const pubsub = new PubSub();

const JWT_SECRET = process.env.JWT_SECRET;

const USER_ADDED = 'USER_ADDED';
const USER_DELETED = 'USER_DELETED';

// UPLOAD FILE
const storeUpload = async ({ stream, newName, filename, mimetype }) => {
    const path = `uploads/${newName}`;

    return new Promise((resolve, reject) =>
        stream
            .pipe(createWriteStream(path))
            .on('finish', () => resolve({ path, filename, mimetype }))
            .on('error', reject)
    );
}

const processUpload = async (newName, upload) => {
    const { filename, mimetype, createReadStream } = await upload;

    console.log(filename, createReadStream);

    const stream = createReadStream();
    const file = await storeUpload({ stream, newName, filename, mimetype });
    return file;
};
// END FILE UPLOAD


export default {
    User: user,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Query: {
        async Login(obj, args, ctx, info) {

            let user = await neo4jgraphql(obj, args, ctx, info);

            if (!user) {
                throw new Error("Email does not exist");
            }

            const isValid = await bcrypt.compare(args.password, user.password);
            if (!isValid) {
                throw new Error("Incorrect password");
            }

            user.token = jsonwebtoken.sign(
                { id: user.id, email: user.email },
                JWT_SECRET || "ilikemusefactory",
                { expiresIn: '1d' }
            );

            return user;
        }
    },
    Mutation: {
        uploadFile: async (_, { newName, file }) => {
            const upload = await processUpload(newName, file);
            return upload;
        },

        async CreateUser(obj, args, ctx, info) {
            args.user.password = await bcrypt.hash(args.user.password, 12);

            // sendmail
            sendMailOut(args.user.email, 'User Registered!', 'Welcome to Musefactory!', '<h1>WELCOME MO FUCKA</h1>');

            return neo4jgraphql(obj, args, ctx, info).then(res => {
                pubsub.publish(USER_ADDED, {
                    mutation: 'CREATED',
                    data: res,
                    previousValues: null
                });
                return res;
            });
        },

        DeleteUser(obj, args, ctx, info) {
            return neo4jgraphql(obj, args, ctx, info).then(res => {
                pubsub.publish(USER_DELETED, {
                    mutation: 'DELETED',
                    data: args.user,
                    previousValues: args.user
                });
                return args.user;
            });
        }
    },
    Subscription: {
        usersChange: {
            subscribe: () => pubsub.asyncIterator([USER_ADDED, USER_DELETED]),
            resolve: (payload, args, ctx, info) => {
                return payload
            }
        }
    },
}