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

  async countAllInstruments() {
    const storeModel = await this.store;
    this.store = storeModel;
    let total = await this.store.instruments.findAndCountAll();
    total = total.count;
    return total;
  }

  async getAllInstruments({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({ limit, offset });
    return instruments;
  }

  async getAllInstrumentsWithModel({
    modelNumber,
    vendor,
    limit = null,
    offset = null,
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({
      limit,
      offset,
      where: { modelNumber, vendor },
    });
    let total = await this.store.instruments.findAndCountAll({ where: { modelNumber, vendor } });
    total = total.count;
    return { rows: instruments, total };
  }

  async getAllInstrumentsWithModelNum({ modelNumber }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({
      limit: null,
      offset: null,
      where: { modelNumber },
    });
    return instruments;
  }

  async getAllInstrumentsWithVendor({ vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({
      limit: null,
      offset: null,
      where: { vendor },
    });
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

  async editInstrument({
    modelNumber, vendor, serialNumber, comment, id,
  }) {
    const response = { message: '', success: true };
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { modelNumber, vendor },
    });
    if (model[0] == null) {
      response.message = 'ERROR: The model that is being changed to is not valid!';
      response.success = false;
      return JSON.stringify(response);
    }
    const instruments = await this.getAllInstrumentsWithModel({
      modelNumber,
      vendor,
    }); // Get all instruments associated with model
    if (instruments) {
      instruments.rows.forEach((element) => {
        if (element.serialNumber === serialNumber && element.id !== id) {
          response.message = 'ERROR: That model-serial number pair already exists!';
          response.success = false;
        } // check that there are no unique conflicts, but exclude ourselves
      });
    }
    if (response.success) {
      this.store.instruments.update(
        {
          modelNumber,
          vendor,
          serialNumber,
          comment,
        },
        { where: { id } },
      );
      response.message = 'Successfully editted instrument!';
    }
    return JSON.stringify(response);
  }

  async deleteInstrument({ id }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.instruments.destroy({ where: { id } });
    await this.store.calibrationEvents.destroy({
      where: { calibrationHistoryIdReference: id },
    });
    response.message = `Deleted Instrument with ID: ${id}`;
    response.success = true;
    return JSON.stringify(response);
  }

  async addInstrument({
    modelNumber, vendor, serialNumber, comment,
  }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.models
      .findAll({ where: { modelNumber, vendor } })
      .then(async (model) => {
        if (model && model[0]) {
          await this.getInstrument({ modelNumber, vendor, serialNumber }).then(
            (instrument) => {
              if (instrument) {
                response.message = `ERROR: Instrument ${vendor} ${modelNumber} ${serialNumber} already exists`;
              } else {
                const modelReference = model[0].dataValues.id;
                const {
                  description,
                  calibrationFrequency,
                } = model[0].dataValues;
                this.store.instruments.create({
                  modelReference,
                  vendor,
                  modelNumber,
                  serialNumber,
                  comment,
                  calibrationFrequency,
                  description,
                });
                response.message = `Added new instrument ${vendor} ${modelNumber} ${serialNumber}!`;
                response.success = true;
              }
            },
          );
        } else {
          response.message = `ERROR: Model ${vendor} ${modelNumber} does not exist`;
        }
      });
    return JSON.stringify(response);
  }
}

module.exports = InstrumentAPI;
