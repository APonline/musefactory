import user from './user';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { createWriteStream } from 'fs';

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

export default {
    User: user,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    Mutation: {
        uploadFile: async (_, { newName, file }) => {
            const upload = await processUpload(newName, file);
            return upload;
        }
    }
}