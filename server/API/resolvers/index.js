import user from './user';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { createWriteStream } from 'fs';
import { neo4jgraphql } from "neo4j-graphql-js";
import "regenerator-runtime/runtime.js";
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

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
    Mutation: {
        uploadFile: async (_, { newName, file }) => {
            const upload = await processUpload(newName, file);
            return upload;
        },

        MergeUser(obj, args, ctx, info) {
            return neo4jgraphql(obj, args, ctx, info).then( res => {
                console.log(res);
                pubsub.publish(USER_ADDED, res );
            });
        },

        DeleteUser(obj, args, ctx, info) {
            return neo4jgraphql(obj, args, ctx, info).then( res => {
                console.log(args);
                pubsub.publish(USER_DELETED, args );
            });
        }
    },
    Subscription: {
        userAdded: {
            subscribe: () => pubsub.asyncIterator(USER_ADDED),
            resolve: payload => {
                return payload
            }
        },
        userDeleted: {
            subscribe: () => pubsub.asyncIterator(USER_DELETED),
            resolve: payload => {
                return payload
            }
        },
    },
}