/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');

class BulkDataAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
    this.response = { success: true, errorList: [] };
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

  async bulkImportData({
    models,
    instruments,
    calibrationEvents,
  }) {
    this.response = { success: true, errorList: [] };
    const storeModel = await this.store;
    this.store = storeModel;
    // loop through models
    // validate (make sure doesn't already exist) if ERROR delete all previous adds
    // add
    await this.addModels(models).then(async (modelResponse) => {
      if (models.length === modelResponse.length) {
        // all models successfully added
      } else {
        // at least one model had errror

        // await this.store.models.destroy({ where: { modelNumber, vendor } });
        // array.forEach(item => console.log(item));
        await this.deleteAddedModels(models, modelResponse);
      }
    });

    // loop through instruments
    // validate (make sure model exists, instrument doesn't) if ERROR delete all previous adds
    // add

    // loop through calibration events
    // validate (make sure instrument exists, date is valid) if ERROR delete all previous adds
    // add
    // response.success = true;
    // response.message = 'Successful bulk import';
    return JSON.stringify(this.response);
  }

  async deleteAddedModels(models, indices) {
    indices.forEach(async (index) => {
      const modelNumber = models[index].modelNumber;
      const vendor = models[index].vendor;
      await this.store.models.destroy({ where: { modelNumber, vendor } });
    });
  }

  async addModels(models) {
    // eslint-disable-next-line prefer-const
    let added = [];
    for (let i = 0; i < models.length; i += 1) {
      const currentModel = models[i];
      const vendor = currentModel.vendor;
      const modelNumber = currentModel.modelNumber;
      const description = currentModel.description;
      const comment = currentModel.comment;
      const calibrationFrequency = currentModel.calibrationFrequency;
      await this.getModel({ modelNumber, vendor }).then((value) => {
        if (value) {
          // invalid model
          this.response.success = false;
          this.response.errorList.push(`Model ${vendor} ${modelNumber} already exists!`);
        } else {
          this.store.models.create({
            vendor,
            modelNumber,
            description,
            comment,
            calibrationFrequency,
          });
          added.push(i);
        }
      });
    }
    return added;
  }

  async getModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { vendor, modelNumber },
    });
    if (model && model[0]) {
      return model[0];
    }
    return null;
  }
}

module.exports = BulkDataAPI;
