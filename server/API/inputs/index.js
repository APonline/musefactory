import fs from 'fs';
import path from 'path';

const inputs = fs
.readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'inputs.graphql')
)
.toString('utf-8');

export default inputs;