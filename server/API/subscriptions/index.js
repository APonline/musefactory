import user from './user';

export default `type Subscription { ${ user } } type SubscriptionPayload { mutation: String data:JSONObject previousValues: JSONObject }`;