// This file deals with what methods a user model should have
const { DataSource } = require('apollo-datasource');
const bcrypt = require('bcryptjs');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * This function takes a userName and password and see if it belongs
   * to a user in the db
   */
  async login({ userName, password }) {
    const response = { success: false, message: '' };
    await this.findUser({ userName }).then((value) => {
      if (!value) {
        response.message = 'Wrong username/password';
      } else {
        response.success = bcrypt.compareSync(password, value.password);
        response.message = response.success
          ? 'Logged in'
          : 'Wrong username/password';
      }
    });
    return JSON.stringify(response);
  }

  async isAdmin({ userName }) {
    let response = false;
    await this.findUser({ userName }).then((value) => {
      if (!value) {
        // no user exists
      } else if (value.isAdmin) {
        response = true;
      }
    });
    return response;
  }

  /**
   * This function attempts to find a user from a given userName
   */
  async findUser({ userName }) {
    // console.log(this.store);
    const storeModel = await this.store;
    this.store = storeModel;
    const user = await this.store.users.findAll({ where: { userName } });
    const exists = user && user[0];
    return exists ? user[0] : null;
  }

  /**
   * This function attempts to create a user if they don't match a userName that's already in use
   */
  async createUser({
    email,
    firstName,
    lastName,
    userName,
    password,
    isAdmin,
  }) {
    const response = { message: '' };
    await this.findUser({ userName }).then((value) => {
      if (value) {
        response.message = 'Username already exists!';
      } else {
        this.store.users.create({
          email,
          firstName,
          lastName,
          userName,
          password,
          isAdmin,
        });
        response.message = 'Account Created!';
      }
    });
    return JSON.stringify(response);
  }
}

module.exports = UserAPI;
