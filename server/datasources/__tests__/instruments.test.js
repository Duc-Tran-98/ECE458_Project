/* eslint-disable no-undef */
const InstrumentAPI = require('../instruments');
const ModelAPI = require('../models');
const { createStore } = require('../../util');

let store;
let modelAPI;
let instrumentAPI;
describe('Test Instrument Database Queries and Mutation', () => {
  beforeAll(async () => {
    store = await createStore(true);
    await store.db.query('SET FOREIGN_KEY_CHECKS = 0').catch(() => undefined);
    await store.db.sync({ force: true }).catch(() => undefined);
    await store.db.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => undefined);
    const testModel = {
      modelNumber: '40A',
      vendor: 'Duke',
      description: 'This is a test voltmeter',
      comment: 'This model is for testing purposes',
      calibrationFrequency: 30,
      supportLoadBankCalibration: true,
    };
    modelAPI = new ModelAPI({ store });
    instrumentAPI = new InstrumentAPI({ store });
    await modelAPI.addModel(testModel);
  });

  it('Should create valid instrument with serial number but no asset tag set', async () => {
    const testInstrument = {
      modelNumber: '40A',
      vendor: 'Duke',
      serialNumber: 'ECE458',
      comment: 'This instrument is for testing purposes',
    };
    const response = await instrumentAPI.addInstrument(testInstrument);
    expect(response).toMatch(response);
  });

  it('Should fail to create instrument with invaild model', async () => {
    const incorrectModel = {
      modelNumber: 'Bad',
      vendor: 'Model',
      serialNumber: 'Should',
      comment: 'Fail',
    };
    const response = await instrumentAPI.addInstrument(incorrectModel);
    expect(response).toMatch(JSON.stringify({
      message: `ERROR: Model ${incorrectModel.vendor} ${incorrectModel.modelNumber} does not exist`,
      success: false,
      assetTag: -1,
    }));
  });

  it('Should create a valid instrument with set asset tag', async () => {
    const assetTagInstrument = {
      modelNumber: '40A',
      vendor: 'Duke',
      assetTag: 100001,
      serialNumber: 'ECE01',
      comment: 'This instrument is for testing purposes',
    };
    const response = await instrumentAPI.addInstrument(assetTagInstrument);
    expect(response).toMatch(JSON.stringify({
      message: `Added new instrument ${assetTagInstrument.vendor} ${assetTagInstrument.modelNumber} ${assetTagInstrument.serialNumber}!`,
      success: true,
      assetTag: 100001,
    }));
  });

  afterAll(async () => {
    await store.db.close().catch(() => undefined);
  });
});
