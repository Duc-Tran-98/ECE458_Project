// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');

class InstrumentAPI extends DataSource {
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

  async getAllInstruments({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({ limit, offset });
    return instruments;
  }

  async getAllInstrumentsWithModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll(
      {
        limit: null,
        offset: null,
        where: { modelNumber, vendor },
      },
    );
    return instruments;
  }

  async getAllInstrumentsWithModelNum({ modelNumber }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll(
      {
        limit: null,
        offset: null,
        where: { modelNumber },
      },
    );
    return instruments;
  }

  async getAllInstrumentsWithVendor({ vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll(
      {
        limit: null,
        offset: null,
        where: { vendor },
      },
    );
    return instruments;
  }

  async getInstrument({ modelNumber, vendor, serialNumber }) {
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
    await this.store.models.findAll({ where: { modelNumber, vendor } }).then(async (model) => {
      if (model && model[0]) {
        await this.getInstrument({ modelNumber, vendor, serialNumber }).then((instrument) => {
          if (instrument) {
            response.message = `ERROR: Instrument ${vendor} ${modelNumber} ${serialNumber} already exists`;
          } else {
            const modelReference = model[0].dataValues.id;
            // eslint-disable-next-line prefer-destructuring
            const calibrationFrequency = model[0].dataValues.calibrationFrequency;
            const isCalibratable = (calibrationFrequency > 0);
            this.store.instruments.create({
              modelReference,
              vendor,
              modelNumber,
              serialNumber,
              isCalibratable,
              comment,
              calibrationFrequency,
            });
            response.message = `Added new instrument: ${vendor} ${modelNumber} ${serialNumber}!`;
          }
        });
      } else {
        response.message = `ERROR: Model ${vendor} ${modelNumber} does not exist`;
      }
    });
    return JSON.stringify(response);
  }

  async deleteInstrument({ modelNumber, vendor, serialNumber }) {
    const response = { message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    const instrument = await this.getInstrument({ modelNumber, vendor, serialNumber });
    if (instrument == null) {
      response.message = `The instrument ${vendor} ${modelNumber} ${serialNumber} could not be found!`;
      response.success = false;
      return JSON.stringify(response);
    }
    await this.store.calibrationEvents.destroy(
      { where: { calibrationHistoryIdReference: instrument.dataValues.id } },
    );
    await this.store.instruments.destroy({ where: { modelNumber, vendor, serialNumber } });
    response.message = `Deleted instrument: ${vendor} ${modelNumber} ${serialNumber}`;
    response.success = true;
    return JSON.stringify(response);
  }
}

module.exports = InstrumentAPI;
