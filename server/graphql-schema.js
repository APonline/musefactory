import types from './API/types';
import inputs from './API/inputs';
import queries from './API/queries';
import mutations from './API/mutations';
import subscriptions from './API/subscriptions';

const upload = `
    scalar Upload
`;

export default upload + queries + inputs + types + mutations + subscriptions; 