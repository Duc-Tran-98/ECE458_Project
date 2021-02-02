// Resolvers define the technique for fetching the types defined in the
// schema.
const bcrypt = require("bcryptjs");
//For hashing password
const saltRounds = 10;
module.exports = {
  Query: {
    me: (_, __, { dataSources }) => dataSources.userAPI.find(),
    isAdmin: (_, { userName }, { dataSources }) =>
      dataSources.userAPI.isAdmin({ userName: userName }),
  },
  Mutation: {
    login: async (_, { userName, password }, { dataSources }) => {
      const response = await dataSources.userAPI.login({
        userName: userName,
        password: password,
      });
      return response.success;
    },
    signup: async (
      _,
      { lastName, email, password, firstName, userName, isAdmin },
      { dataSources }
    ) => {
      //gen salt and hash user's password, then pass to api so it can be put in DB
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const response = await dataSources.userAPI.createUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        password: hash,
        isAdmin: isAdmin,
      });
      return response.success;
    },
  },
};
