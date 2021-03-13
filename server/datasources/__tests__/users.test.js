/* eslint-disable no-undef */
const faker = require('faker');
const UserAPI = require('../users');
const { createStore } = require('../../util');

let store;
let userAPI;
describe('Test User API Methods', () => {
  beforeAll(async () => {
    store = await createStore();
    await store.db.query('SET FOREIGN_KEY_CHECKS = 0').catch(() => undefined);
    await store.db.sync({ force: true }).catch(() => undefined);
    await store.db.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => undefined);
    userAPI = new UserAPI({ store });
  });

  it('Create a user without admin status', async () => {
    const testUser = {
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      password: faker.internet.password(),
      isAdmin: false,
    };
    const response = await userAPI.createUser(testUser);
    expect(response).toMatch(JSON.stringify({
      message: 'Account Created!',
      success: true,
    }));
  });

  afterAll(async () => {
    await store.db.close().catch(() => undefined);
  });
});
