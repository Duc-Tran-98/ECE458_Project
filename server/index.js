/* eslint-disable max-len */
// This is the actual backend server;
const { ApolloServer } = require('apollo-server');
// const { ApolloServer } = require('apollo-server-express');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
// const bodyParser = require('body-parser');
const { createVerifier } = require('fast-jwt');
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
    const verifyWithPromise = createVerifier({ key: async () => 'secret' });
    const user = await verifyWithPromise(auth).then((value) => value).catch(() => (null)); // decode jwt
    if (user) { // if decode ok
      const storeModel = await store;
      const userVals = await storeModel.users.findAll({ where: { userName: user.userName } }).then((val) => {
        if (val && val[0]) { // look up user and return their info
          return val[0].dataValues;
        }
        return null; // return null if user no longer exists
      });
      return { user: userVals }; // return user: userVals(null if user doesn't exist/no jwt header, not null if jwt okay and user exists) to API classes
    }
    return { user: null };
  },
  /*
  sections === {
    header: { alg: 'HS512', typ: 'JWT' },
    payload: { a: 1, b: 2, c: 3, iat: 1579521212 },
    signature:
    'mIcxteEVjbh2MnKQ3EQlojZojGSyA/guqRBYHQURcfnCSSBTT2OShF8lo9/ogjAv+5oECgmCur/cDWB7x3X53g==',
    input: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoyLCJjIjozLCJpYXQiOjE1Nzk1MjEyMTJ9'
  }
*/
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
const whichRoute = process.env.NODE_ENV.includes('dev') ? '/api' : '/express/api';

app.post(`${whichRoute}/oauthConsume`, (req, res) => {
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

app.get(`${whichRoute}/userinfo`, (req, res) => {
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/usr/src/app/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const filter = function (req, file, cb) {
  // accept image only
  // if (1 === 2) {
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|xlsx)$/)) {
  // eslint-disable-next-line max-len
  //   return cb(new Error('Only files of the format JPG, PNG, GIF, PDF, or XLSX are allowed!'), false);
  // }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 32 * 1024 * 1024,
  },
  fileFilter: filter,
});

app.post(`${whichRoute}/upload`, upload.any(), (req, res, next) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send({
    assetName: req.files[0].filename,
    fileName: req.files[0].originalname,
  });
});

app.post(`${whichRoute}/uploadExcel`, (req, res) => {
  // Do some things
  res.send('Hello World');
});

app.listen({ port: expressPort }, () => console.log(`🚀 Express Server ready at http://localhost:${expressPort}, whichRoute = ${whichRoute}`));
