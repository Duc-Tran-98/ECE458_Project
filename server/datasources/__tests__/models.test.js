const ModelAPI = require('../models');
const { createStore } = require('../../util');

let store;
describe('Test Model Creation and Querying', () => {
  beforeAll(async () => {
    store = await createStore();
    await store.db.query('SET FOREIGN_KEY_CHECKS = 0').catch(() => undefined);
    await store.db.sync({ force: true }).catch(() => undefined);
    await store.db.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => undefined);
  });

  const testModel = {
    modelNumber: 'Duke',
    vendor: 'Voltmeter',
    description: 'This is a test voltmeter',
    comment: 'This model is for testing purposes',
    calibrationFrequency: 30,
    supportLoadBankCalibration: true,
  };

  it('Should succeed in creating a new model with valid inputs', async () => {
    const modelAPI = new ModelAPI({ store });

    const response = await modelAPI.addModel(testModel);
    expect(response).toMatch(JSON.stringify({
      message: `Added new model, ${testModel.vendor} ${testModel.modelNumber}, into the DB!`,
      success: true,
    }));
  });
  it('Should fail on trying to create a duplicate model', async () => {
    const modelAPI = new ModelAPI({ store });

    const response = await modelAPI.addModel(testModel);
    expect(response).toMatch(JSON.stringify({
      message: `Model ${testModel.vendor} ${testModel.modelNumber} already exists!`,
      success: false,
    }));
  });
  afterAll(async () => {
    await store.db.close().catch(() => undefined);
  });
});
