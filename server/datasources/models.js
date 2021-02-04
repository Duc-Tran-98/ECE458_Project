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

  async getAllModels() {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll();
    return models;
  }

  async findModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({ where: { modelNumber, vendor } });
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
    await this.findModel({ modelNumber, vendor }).then((value) => {
      if (value) {
        response.message = 'Model Number & Vendor pair already exists';
      } else {
        this.store.models.create({
          modelNumber,
          vendor,
          description,
          comment,
          calibrationFrequency,
        });
        response.message = 'Added new model!';
      }
    });
    return JSON.stringify(response);
  }
}

module.exports = ModelAPI;
