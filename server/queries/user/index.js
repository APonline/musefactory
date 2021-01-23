import fs from 'fs';
import path from 'path';

const queries = fs
.readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'user.graphql')
)
.toString('utf-8');

export default queries;