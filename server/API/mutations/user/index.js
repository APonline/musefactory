import fs from 'fs';
import path from 'path';

const mutations = fs
.readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'user.graphql')
)
.toString('utf-8');

export default mutations;