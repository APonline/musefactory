import types from './types';
import inputs from './inputs';
import queries from './queries';
import mutations from './mutations';

const upload = `
    scalar Upload
`;

export default upload + queries + inputs + types + mutations; 