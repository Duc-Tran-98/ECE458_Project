const ModelAPI = require('../models');
const UserAPI = require('../users');
const InstrumentAPI = require('../instruments');
const CalibrationEventAPI = require('../calibrationEvents');
const BulkDataAPI = require('../bulkData');
const { createStore } = require('../../util');

describe('Test Model Creation and Querying', () => {
  const store = createStore();
  const dataSources = () => ({
    userAPI: new UserAPI({ store }),
    modelAPI: new ModelAPI({ store }),
    instrumentAPI: new InstrumentAPI({ store }),
    calibrationEventAPI: new CalibrationEventAPI({ store }),
    bulkDataAPI: new BulkDataAPI({ store }),
  });

  it('Should succeed in creating a new model with valid inputs', async () => {
    const testModel = {
      modelNumber: 'Duke',
      vendor: 'Voltmeter',
      description: 'This is a test voltmeter',
      comment: 'This model is for testing purposes',
      calibrationFrequency: 30,
      supportLoadBankCalibration: true,
    };
    const response = await dataSources.modelAPI.addModel(testModel);
    expect(response).toMatchObject({
      message: `Added new model, ${testModel.vendor} ${testModel.modelNumber}, into the DB!`,
      success: true,
    });
  });
  it('Should fail on trying to create a duplicate model', async () => {
    const testModel = {
      modelNumber: 'Duke',
      vendor: 'Voltmeter',
      description: 'This is a test voltmeter',
      comment: 'This model is for testing purposes',
      calibrationFrequency: 30,
      supportLoadBankCalibration: true,
    };
    const response = await dataSources.modelAPI.addModel(testModel);
    expect(response).toMatchObject({
      message: `Model ${testModel.vendor} ${testModel.modelNumber} already exists!`,
      success: false,
    });
  });
});
