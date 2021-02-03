// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');

class CalibrationEventAPI extends DataSource {
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

  async getAllCalibrationEvents() {
    const storeModel = await this.store;
    this.store = storeModel;
    const calibrationEvents = await this.store.calibrationEvents.findAll();
    return calibrationEvents;
  }
}

module.exports = CalibrationEventAPI;
