const ModelAPI = require('../models');
const { createStore } = require('../../util');

describe('Test Model Creation and Querying', () => {
  beforeAll(async () => {
    const store = await createStore();
    await store.db.query('SET FOREIGN_KEY_CHECKS = 0');
    await store.db.sync({ force: true }).then(async () => await store.db.query('SET FOREIGN_KEY_CHECKS = 1'));
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
    const store = await createStore();
    const modelAPI = new ModelAPI({ store });

    const response = await modelAPI.addModel(testModel);
    expect(response).toMatch(JSON.stringify({
      message: `Added new model, ${testModel.vendor} ${testModel.modelNumber}, into the DB!`,
      success: true,
    }));
  });
  it('Should fail on trying to create a duplicate model', async () => {
    const store = await createStore();
    const modelAPI = new ModelAPI({ store });

    const response = await modelAPI.addModel(testModel);
    expect(response).toMatch(JSON.stringify({
      message: `Model ${testModel.vendor} ${testModel.modelNumber} already exists!`,
      success: false,
    }));
  });
});
