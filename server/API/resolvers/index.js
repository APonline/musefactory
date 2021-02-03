import user from './user';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { createWriteStream } from 'fs';
import { neo4jgraphql } from "neo4j-graphql-js";
import "regenerator-runtime/runtime.js";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

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

const USER_ADDED = 'USER_ADDED';

export default {
    User: user,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Mutation: {
        uploadFile: async (_, { newName, file }) => {
            const upload = await processUpload(newName, file);
            return upload;
        },

        MergeUser: async (_, args, {user}) => {
            console.log(user, args)
            //pubsub.publish(USER_ADDED, { allUsers: args});
            return args;
        },

        /*DeleteUser: async (_, args, {models}) => {
            pubsub.publish(USER_ADDED, { args });
            return args;
        }*/
        DeleteUser(object, params, ctx, info) {
             
            const res = neo4jgraphql(object, params, ctx, info);
            console.log(res);
            console.log(params)
            pubsub.publish(USER_ADDED, { params });
            return res;
        }
        /*DeleteUser(id: Int): User
            @cypher (
                statement: """
                    MATCH (u:User)
                    WHERE id(u)=$id

                    DETACH DELETE u
                """
            )*/

    },
    Subscription: {
        allUsers: {
            subscribe: () => pubsub.asyncIterator(USER_ADDED),
            resolve: payload => {
                return payload
              }
        },
    },
}