import fs from 'fs';
import path from 'path';

const types = fs
.readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'user.graphql')
)
.toString('utf-8');

export default types + ' ';