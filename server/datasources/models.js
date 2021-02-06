// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');

class ModelAPI extends DataSource {
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

  async deleteModel({ modelNumber, vendor }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.getModel({ modelNumber, vendor });
    const modelReference = model.dataValues.id;
    await this.store.instruments.findAll({ where: { modelReference } }).then(async (data) => {
      if (data && data[0]) {
        response.message = 'ERROR: Instrument is dependent on model!';
      } else {
        await this.store.models.destroy({ where: { modelNumber, vendor } });
        response.message = 'Model deleted!';
        response.success = true;
      }
    });
    return JSON.stringify(response);
  }

  async editModel({
    id,
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const response = { message: '', success: false };
    await this.getModel({ modelNumber, vendor }).then((value) => {
      if (value) {
        response.message = 'That model number and vendor pair already exists!';
      } else {
        this.store.models.update(
          {
            modelNumber,
            vendor,
            description,
            comment,
            calibrationFrequency,
          },
          { where: { id } },
        );
        response.message = 'Model Updated Successfully!';
        response.success = true;
      }
    });
    return JSON.stringify(response);
  }

  async getAllModels() {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll();
    return models;
  }

  async getModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { modelNumber, vendor },
    });
    if (model && model[0]) {
      return model[0];
    }
    return null;
  }

  async addModel({
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
  }) {
    const response = { message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getModel({ modelNumber, vendor }).then((value) => {
      if (value) {
        response.message = `Model ${vendor} ${modelNumber} already exists`;
      } else {
        this.store.models.create({
          modelNumber,
          vendor,
          description,
          comment,
          calibrationFrequency,
        });
        response.message = `Added new model, ${vendor} ${modelNumber}, into the DB!`;
      }
    });
    return JSON.stringify(response);
  }
}

module.exports = ModelAPI;
