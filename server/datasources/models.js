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

  async addModel({
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
  }) {
    const response = { success: false, message: '' };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.models.create({
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
    });
    response.success = true;
    response.message = 'added model';
    return JSON.stringify(response);
  }
}

module.exports = ModelAPI;
