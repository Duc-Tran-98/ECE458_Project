// This is the actual backend server;
const { ApolloServer } = require('apollo-server');
// const { ApolloServer } = require('apollo-server-express');
const isEmail = require('isemail');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const typeDefs = require('./schema');
const UserAPI = require('./datasources/users');
const ModelAPI = require('./datasources/models');
const InstrumentAPI = require('./datasources/instruments');
const CalibrationEventAPI = require('./datasources/calibrationEvents');
const { createStore, createDB } = require('./util');
const resolvers = require('./resolvers');
const BulkDataAPI = require('./datasources/bulkData');

const { oauthClientId, oauthClientSecret, oauthRedirectURI } = require('./config');

// Connect to db and init tables
let store;
createDB().then(() => {
  store = createStore();
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
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;
    return { user: { ...user.dataValues } };
  },
  // Additional constructor options
  typeDefs,
  resolvers,
  dataSources,
});

server.listen().then(() => {
  console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/dev
  `);
});

// Create express server with oauth route
const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const expressPort = 4001;

app.post('/api/oauthConsume', (req, res) => {
  const { code } = req.body;
  const authString = Buffer.from(
    `${oauthClientId}:${oauthClientSecret}`,
  ).toString('base64');
  const url = process.env.OAUTH_TOKEN_URL ? process.env.OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';

  const options = {
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`,
    },
    data: `grant_type=authorization_code&redirect_uri=${encodeURI(
      oauthRedirectURI,
    )}&code=${code}`,
  };

  axios(options)
    .then((response) => {
      res.json({
        success: true,
        result: response.data,
      });
    })
    .catch((err) => {
      res.json({
        error: err,
        success: false,
      });
    });
});

app.get('/api/userinfo', (req, res) => {
  const url = 'https://oauth.oit.duke.edu/oidc/userinfo';
  const { accessToken } = req.query;

  const options = {
    url,
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  console.log('calling userInfo API with options: ');
  console.log(options);

  axios(options)
    .then((response) => {
      console.log(response);
      res.json({
        success: true,
        result: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        error: err,
        success: false,
      });
    });
});

app.listen({ port: expressPort }, () => console.log(`🚀 Server ready at http://localhost:${expressPort}`));
