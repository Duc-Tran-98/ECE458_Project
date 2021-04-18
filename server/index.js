/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-concat */
/* eslint-disable max-len */
// This is the actual backend server;
const { ApolloServer, AuthenticationError } = require('apollo-server');

const { createVerifier } = require('fast-jwt');
const typeDefs = require('./schema');
const UserAPI = require('./datasources/users');
const ModelAPI = require('./datasources/models');
const InstrumentAPI = require('./datasources/instruments');
const CalibrationEventAPI = require('./datasources/calibrationEvents');
const { createStore, createDB } = require('./util');
const resolvers = require('./resolvers');
const BulkDataAPI = require('./datasources/bulkData');

require('./express'); // use express server too

// Connect to db and init tables
let store;
createDB().then(async () => {
  store = await createStore(false);
  const checkVoltmeter = await store.modelCategories.findOne({
    where: { name: 'voltmeter' },
  });
  if (checkVoltmeter === null) {
    await store.modelCategories.create({
      name: 'voltmeter',
    });
  }
  const checkShuntmeter = await store.modelCategories.findOne({
    where: { name: 'current_shunt_meter' },
  });
  if (checkShuntmeter === null) {
    await store.modelCategories.create({
      name: 'current_shunt_meter',
    });
  }
  const checkKlufe = await store.modelCategories.findOne({
    where: { name: 'Klufe_K5700-compatible' },
  });
  if (checkKlufe === null) {
    await store.modelCategories.create({
      name: 'Klufe_K5700-compatible',
    });
  }
});

// Define api
const dataSources = () => ({
  userAPI: new UserAPI({ store }),
  modelAPI: new ModelAPI({ store }),
  instrumentAPI: new InstrumentAPI({ store }),
  calibrationEventAPI: new CalibrationEventAPI({ store }),
  bulkDataAPI: new BulkDataAPI({ store }),
});

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    if (process.env.NODE_ENV.includes('dev')) {
      return { user: null };
    }
    const auth = (req.headers && req.headers.authorization) || ''; // get jwt from header
    const verifyWithPromise = createVerifier({ key: async () => 'secret' });
    const user = await verifyWithPromise(auth)
      .then((value) => value)
      .catch(() => null); // decode jwt
    // let { query } = req.body;
    // query = JSON.stringify(query);
    // if (!user && !(query.includes('mutation LoginMutation') || query.includes('mutation OAuthSignOn'))) {
    //   // and query !== login, then that's invalid access
    //   console.log('invalid access');
    //   throw new AuthenticationError('you must be logged in');
    // }
    // // if decode ok
    const storeModel = await store;
    const userVals = await storeModel.users
      .findAll({
        where: { userName: user?.userName || req.body?.variables?.userName },
      })
      .then((val) => {
        if (val && val[0]) {
          // look up user and return their info
          return val[0].dataValues;
        }
        return null; // return null if user no longer exists
      })
      .catch(() => null);

    return { user: userVals }; // return user: userVals(null if user doesn't exist/no jwt header, not null if jwt okay and user exists) to API classes
  },
  // Additional constructor options
  typeDefs,
  resolvers,
  dataSources,
  subscriptions: {
    // eslint-disable-next-line no-unused-vars
    onConnect: (connectionParams, webSocket) => {
      console.log('connected: ');
    },
    // eslint-disable-next-line no-unused-vars
    onDisconnect: (connectionParams, webSocket) => {
      console.log('disconnected: ');
    },
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`
    Server is running at ${url}\n
    Subscriptions Ready at ${subscriptionsUrl}
    Explore at https://studio.apollographql.com/dev
  `);
});
