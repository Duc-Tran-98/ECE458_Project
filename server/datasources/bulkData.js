/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

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
  }) {
    this.response = { success: true, errorList: [] };
    const storeModel = await this.store;
    this.store = storeModel;

    let anyError = false;
    let addedModels = [];
    let addedInstruments = [];

    if (models != null) {
      await this.addModels(models).then(async (modelResponse) => {
        addedModels = modelResponse;
        if (models.length !== modelResponse.length) {
          anyError = true;
        }
      });
    }

    if (instruments != null) {
      await this.addInstruments(instruments).then(async (instrumentResponse) => {
        addedInstruments = instrumentResponse;
        if (instruments.length !== instrumentResponse.length) {
          anyError = true;
        }
      });
    }

    if (anyError) {
      if (instruments != null) await this.deleteAddedInstruments(instruments, addedInstruments);
      if (models != null) await this.deleteAddedModels(models, addedModels);
      this.response.success = false;
    }
    return JSON.stringify(this.response);
  }

  async addInstruments(instruments) {
    // eslint-disable-next-line prefer-const
    let added = [];
    for (let i = 0; i < instruments.length; i += 1) {
      const currentInstrument = instruments[i];
      const vendor = currentInstrument.vendor;
      const modelNumber = currentInstrument.modelNumber;
      const serialNumber = currentInstrument.serialNumber;
      const comment = currentInstrument.comment;
      const calibrationUser = currentInstrument.calibrationUser;
      const calibrationDate = currentInstrument.calibrationDate;
      const calibrationComment = currentInstrument.calibrationComment;
      if (calibrationUser == null && calibrationDate != null
        || calibrationUser != null && calibrationDate == null) {
        this.response.errorList.push(`ERROR: (Malformed Input) Calibration event for instrument ${vendor} ${modelNumber} ${serialNumber} must have user and date`);
        // eslint-disable-next-line no-continue
        continue;
      }

      if (calibrationDate != null && !isValidDate(calibrationDate)) {
        this.response.errorList.push(`ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} Date must be in format YYYY-MM-DD`);
        // eslint-disable-next-line no-continue
        continue;
      }

      await this.store.models.findAll({ where: { modelNumber, vendor } }).then(async (model) => {
        if (model && model[0]) {
          await this.getInstrument({
            modelNumber, vendor, serialNumber,
          }).then(async (instrument) => {
            if (instrument) {
              this.response.errorList.push(`ERROR: (Duplicate Input) Cannot add instrument ${vendor} ${modelNumber} ${serialNumber} already exists`);
            } else {
              const modelReference = model[0].dataValues.id;
              // eslint-disable-next-line prefer-destructuring
              const { description, calibrationFrequency } = model[0].dataValues;
              if (calibrationUser != null && calibrationFrequency < 1) {
                this.response.errorList.push(`ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} is not calibratable`);
                return;
              }
              const isCalibratable = (calibrationFrequency > 0);
              const inst = await this.store.instruments.create({
                modelReference,
                vendor,
                modelNumber,
                serialNumber,
                isCalibratable,
                comment,
                calibrationFrequency,
                description,
              });
              const calibrationHistoryIdReference = inst.dataValues.id;

              if (calibrationUser != null) {
                await this.store.calibrationEvents.create({
                  calibrationHistoryIdReference,
                  user: calibrationUser,
                  date: calibrationDate,
                  comment: calibrationComment,
                });
              }
              added.push(i);
            }
          });
        } else {
          this.response.errorList.push(`ERROR: (Invalid Input) Cannot add instrument, model ${vendor} ${modelNumber} does not exist`);
        }
      });
    }
    return added;
  }

  async deleteAddedInstruments(instruments, indices) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const index of indices) {
      const modelNumber = instruments[index].modelNumber;
      const vendor = instruments[index].vendor;
      const serialNumber = instruments[index].serialNumber;
      await this.store.instruments.destroy({ where: { modelNumber, vendor, serialNumber } });
    }
  }

  async deleteAddedModels(models, indices) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const index of indices) {
      const modelNumber = models[index].modelNumber;
      const vendor = models[index].vendor;
      await this.store.models.destroy({ where: { modelNumber, vendor } });
    }
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
      await this.getModel({ modelNumber, vendor }).then(async (value) => {
        if (value) {
          // invalid model
          this.response.success = false;
          this.response.errorList.push(`ERROR (Duplicate Input) Model ${vendor} ${modelNumber} already exists!`);
        } else {
          await this.store.models.create({
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
}

module.exports = BulkDataAPI;
