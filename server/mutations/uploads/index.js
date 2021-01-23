import fs from 'fs';
import path from 'path';

const mutations = fs
.readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'uploads.graphql')
)
.toString('utf-8');

export default mutations;