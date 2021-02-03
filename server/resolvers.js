// Resolvers define the technique for fetching the types defined in the
// schema.
const bcrypt = require('bcryptjs');
// For hashing password
const saltRounds = 10;
module.exports = {
  Query: {
    me: (_, __, { dataSources }) => dataSources.userAPI.find(),
    isAdmin: (_, { userName }, { dataSources }) => dataSources.userAPI.isAdmin({ userName }),
    getAllModels: (_, __, { dataSources }) => dataSources.modelAPI.getAllModels(),
    getAllInstruments: (_, __, { dataSources }) => dataSources.instrumentAPI.getAllInstruments(),
    getAllCalibrationEvents: (_, __, {
      dataSources,
    }) => dataSources.calibrationEventAPI.getAllCalibrationEvents(),
  },
  Mutation: {
    login: async (_, { userName, password }, { dataSources }) => {
      const response = await dataSources.userAPI.login({
        userName,
        password,
      });
      return response;
    },
    signup: async (
      _,
      {
        lastName, email, password, firstName, userName, isAdmin,
      },
      { dataSources },
    ) => {
      // gen salt and hash user's password, then pass to api so it can be put in DB
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const response = await dataSources.userAPI.createUser({
        email,
        firstName,
        lastName,
        userName,
        password: hash,
        isAdmin,
      });
      return response;
    },
  },
};
