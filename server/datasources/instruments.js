// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const ModelAPI = require('./models');

class InstrumentAPI extends DataSource {
  constructor({ store }) {
    super();
    this.modelAPI = new ModelAPI({ store });
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

  async getAllInstruments() {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll();
    return instruments;
  }

  async findInstrument({ modelNumber, vendor, serialNumber }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instrument = await this.store.instruments.findAll({
      where: { modelNumber, vendor, serialNumber },
    });
    if (instrument && instrument[0]) {
      return instrument[0];
    }
    return null;
  }

  async addInstrument({
    modelNumber,
    vendor,
    serialNumber,
    comment,
  }) {
    const response = { message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.modelAPI.findModel({ modelNumber, vendor }).then(async (model) => {
      if (model) {
        await this.findInstrument({ modelNumber, vendor, serialNumber }).then((instrument) => {
          if (instrument) {
            response.message = 'ERROR: Instrument with this modelNumber/vendor/serialNumber already exists';
          } else {
            const modelReference = model.dataValues.id;
            // eslint-disable-next-line prefer-destructuring
            const calibrationFrequency = model.dataValues.calibrationFrequency;
            this.store.instruments.create({
              modelReference,
              vendor,
              modelNumber,
              serialNumber,
              calibrationFrequency,
              comment,
            });
            response.message = 'Added new instrument!';
          }
        });
      } else {
        response.message = 'ERROR: No corresponding model exists';
      }
    });
    return JSON.stringify(response);
  }
}

module.exports = InstrumentAPI;
