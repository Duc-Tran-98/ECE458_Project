// This is the actual backend server;
const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');
const typeDefs = require('./schema');
const UserAPI = require('./datasources/users').default;
const { createStore } = require('./util');
const resolvers = require('./resolvers');

// Connect to db and init tables
const store = createStore();

// Define api
const dataSources = () => ({
  userAPI: new UserAPI({ store }),
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
  // console.log("datasources: " + dataSources.userAPI);
});
