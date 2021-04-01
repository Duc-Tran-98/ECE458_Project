/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unreachable */
/* eslint-disable no-loop-func */
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

  async bulkImportModels({ models }) {
    const response = { success: false, message: '' };
    if (!process.env.NODE_ENV.includes('dev')) {
      const { user } = this.context;
      if (!user.isAdmin || !user.modelPermission) {
        response.message = 'ERROR: User does not have permission';
        return JSON.stringify(response);
      }
    }
    const storeModel = await this.store;
    this.store = storeModel;
    // First, we start a transaction and save it into a variable
    const t = await this.store.db.transaction();

    try {
      const catMap = new Map();
      const cats = await this.store.modelCategories.findAll();
      for (let i = 0; i < cats.length; i += 1) {
        catMap.set(cats[i].dataValues.name.toLowerCase(), cats[i].dataValues.id);
      }

      for (let i = 0; i < models.length; i += 1) {
        const currentModel = models[i];
        const vendor = currentModel.vendor;
        const modelNumber = currentModel.modelNumber;
        const description = currentModel.description;
        const comment = currentModel.comment;
        const calibrationFrequency = currentModel.calibrationFrequency;
        const categories = currentModel.categories;
        const supportLoadBankCalibration = currentModel.supportLoadBankCalibration;
        const supportKlufeCalibration = currentModel.supportKlufeCalibration;

        const createdModel = await this.store.models.create(
          {
            vendor,
            modelNumber,
            description,
            comment,
            calibrationFrequency,
            supportLoadBankCalibration,
            supportKlufeCalibration,
            supportCustomCalibration: false,
            requiresCalibrationApproval: false,
          },
          { transaction: t },
        );
        const modelId = createdModel.dataValues.id;
        if (categories) {
          for (let j = 0; j < categories.length; j += 1) {
            const name = categories[j];
            if (catMap.has(name.toLowerCase())) {
              const modelCategoryId = catMap.get(name.toLowerCase());
              await this.store.modelCategoryRelationships.create({
                modelId,
                modelCategoryId,
              }, { transaction: t });
            } else {
              const createdCat = await this.store.modelCategories.create(
                {
                  name,
                },
                { transaction: t },
              );
              const modelCategoryId = createdCat.dataValues.id;
              catMap.set(name.toLowerCase(), modelCategoryId);
              await this.store.modelCategoryRelationships.create({
                modelId,
                modelCategoryId,
              }, { transaction: t });
            }
          }
        }
      }

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();
      response.message = 'Succesfully imported models';
      response.success = true;
    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      console.log(error);
      await t.rollback();
      response.success = false;
      response.message = `ERROR (type: ${error.errors[0].type}) (value: ${error.errors[0].value})`;
    }

    return JSON.stringify(response);
  }

  async bulkImportInstruments({ instruments }) {
    const response = { success: true, message: '' };
    if (!process.env.NODE_ENV.includes('dev')) {
      const { user } = this.context;
      if (!user.isAdmin || !user.instrumentPermission) {
        response.message = 'ERROR: User does not have permission';
        return JSON.stringify(response);
      }
    }
    const storeModel = await this.store;
    this.store = storeModel;
    const t = await this.store.db.transaction();

    try {
      // Then, we do some calls passing this transaction as an option:
      const assetTags = await this.store.instruments.findAll({
        attributes: ['assetTag'],
      });
      // eslint-disable-next-line prefer-const
      let tags = assetTags.map((item) => item.dataValues.assetTag);
      let tagsLoop = 100000;
      const catMap = new Map();
      const cats = await this.store.instrumentCategories.findAll();
      for (let i = 0; i < cats.length; i += 1) {
        catMap.set(cats[i].dataValues.name.toLowerCase(), cats[i].dataValues.id);
      }

      for (let i = 0; i < instruments.length; i += 1) {
        const currentInstrument = instruments[i];
        const assetTag = currentInstrument.assetTag;
        if (assetTag !== null) {
          // validate and add instruments
          const vendor = currentInstrument.vendor;
          const modelNumber = currentInstrument.modelNumber;
          const comment = currentInstrument.comment;
          let serialNumber = currentInstrument.serialNumber;
          const categories = currentInstrument.categories;
          const calibrationUser = currentInstrument.calibrationUser;
          const calibrationDate = currentInstrument.calibrationDate;
          const calibrationComment = currentInstrument.calibrationComment;

          if (
            (calibrationUser == null && calibrationDate != null)
            || (calibrationUser != null && calibrationDate == null)
          ) {
            response.message = `ERROR: (Malformed Input) Calibration event for instrument ${vendor} ${modelNumber} ${serialNumber} must have user and date`;
            response.success = false;
            return JSON.stringify(response);
          }

          if (calibrationDate != null && !isValidDate(calibrationDate)) {
            response.message = `ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} Date must be in format YYYY-MM-DD`;
            response.success = false;
            return JSON.stringify(response);
          }

          await this.store.models
            .findOne({ where: { modelNumber, vendor } }, { transaction: t })
            .then(async (model) => {
              if (model) {
                if (serialNumber) {
                  await this.getInstrument(
                    { modelNumber, vendor, serialNumber },
                    { transaction: t },
                  ).then(async (instrument) => {
                    if (instrument) {
                      throw new Error(
                        `ERROR (type: instrument already exists) (value: ${vendor} ${modelNumber} ${serialNumber})`,
                      );
                    }
                  });
                }
                const { description, calibrationFrequency } = model.dataValues;
                if (calibrationUser != null && calibrationFrequency < 1) {
                  throw new Error(
                    `ERROR (type: cannot calibrate not calibratble instrument) (value: ${vendor} ${modelNumber} ${serialNumber})`,
                  );
                }
                let newAssetTag;
                if (assetTag) {
                  await this.store.instruments
                    .findOne(
                      {
                        where: { assetTag },
                        include: {
                          all: true,
                        },
                        transaction: t,
                      },
                      { transaction: t },
                    )
                    .then((instrument) => {
                      if (instrument) {
                        throw new Error(
                          `ERROR (type: asset tag already exists) (value: ${assetTag})`,
                        );
                      } else {
                        newAssetTag = assetTag;
                      }
                    });
                } else {
                  for (let j = tagsLoop; j < 1000000; j += 1) {
                    if (!tags.includes(j)) {
                      newAssetTag = j;
                      tagsLoop = j + 1;
                      break;
                    }
                  }
                }
                if (response.success) {
                  if (serialNumber == null) serialNumber = '';
                  const modelReference = model.dataValues.id;
                  tags.push(newAssetTag);
                  const newInstrumentData = {
                    modelReference,
                    vendor,
                    modelNumber,
                    serialNumber,
                    comment,
                    calibrationFrequency,
                    description,
                    assetTag: newAssetTag,
                  };
                  // eslint-disable-next-line max-len
                  const created = await this.store.instruments.create(
                    newInstrumentData,
                    { transaction: t },
                  );
                  const instrumentId = created.dataValues.id;
                  // add calibration event if included
                  if (calibrationUser != null) {
                    await this.store.calibrationEvents.create(
                      {
                        calibrationHistoryIdReference: instrumentId,
                        user: calibrationUser,
                        date: calibrationDate,
                        comment: calibrationComment,
                      },
                      { transaction: t },
                    );
                  }
                  if (categories) {
                    for (let j = 0; j < categories.length; j += 1) {
                      const name = categories[j];
                      if (catMap.has(name.toLowerCase())) {
                        const instrumentCategoryId = catMap.get(name.toLowerCase());
                        await this.store.instrumentCategoryRelationships.create({
                          instrumentId,
                          instrumentCategoryId,
                        }, { transaction: t });
                      } else {
                        const createdCat = await this.store.instrumentCategories.create(
                          {
                            name,
                          },
                          { transaction: t },
                        );
                        const instrumentCategoryId = createdCat.dataValues.id;
                        catMap.set(name.toLowerCase(), instrumentCategoryId);
                        await this.store.instrumentCategoryRelationships.create({
                          instrumentId,
                          instrumentCategoryId,
                        }, { transaction: t });
                      }
                    }
                  }
                }
              } else {
                throw new Error(
                  `ERROR (type: model does not exist) (value: ${vendor} ${modelNumber})`,
                );
              }
            });
        }
      }

      for (let i = 0; i < instruments.length; i += 1) {
        const currentInstrument = instruments[i];
        const assetTag = currentInstrument.assetTag;
        if (assetTag === null) {
          // validate and add instruments
          const vendor = currentInstrument.vendor;
          const modelNumber = currentInstrument.modelNumber;
          const comment = currentInstrument.comment;
          let serialNumber = currentInstrument.serialNumber;
          const categories = currentInstrument.categories;
          const calibrationUser = currentInstrument.calibrationUser;
          const calibrationDate = currentInstrument.calibrationDate;
          const calibrationComment = currentInstrument.calibrationComment;

          if (
            (calibrationUser == null && calibrationDate != null)
            || (calibrationUser != null && calibrationDate == null)
          ) {
            response.message = `ERROR: (Malformed Input) Calibration event for instrument ${vendor} ${modelNumber} ${serialNumber} must have user and date`;
            response.success = false;
            return JSON.stringify(response);
          }

          if (calibrationDate != null && !isValidDate(calibrationDate)) {
            response.message = `ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} Date must be in format YYYY-MM-DD`;
            response.success = false;
            return JSON.stringify(response);
          }

          await this.store.models
            .findOne({ where: { modelNumber, vendor } }, { transaction: t })
            .then(async (model) => {
              if (model) {
                if (serialNumber) {
                  await this.getInstrument(
                    { modelNumber, vendor, serialNumber },
                    { transaction: t },
                  ).then(async (instrument) => {
                    if (instrument) {
                      throw new Error(
                        `ERROR (type: instrument already exists) (value: ${vendor} ${modelNumber} ${serialNumber})`,
                      );
                    }
                  });
                }
                const { description, calibrationFrequency } = model.dataValues;
                if (calibrationUser != null && calibrationFrequency < 1) {
                  throw new Error(
                    `ERROR (type: cannot calibrate not calibratble instrument) (value: ${vendor} ${modelNumber} ${serialNumber})`,
                  );
                }
                let newAssetTag;
                if (assetTag) {
                  await this.store.instruments
                    .findOne(
                      {
                        where: { assetTag },
                        include: {
                          all: true,
                        },
                        transaction: t,
                      },
                      { transaction: t },
                    )
                    .then((instrument) => {
                      if (instrument) {
                        throw new Error(
                          `ERROR (type: asset tag already exists) (value: ${assetTag})`,
                        );
                      } else {
                        newAssetTag = assetTag;
                      }
                    });
                } else {
                  for (let j = tagsLoop; j < 1000000; j += 1) {
                    if (!tags.includes(j)) {
                      newAssetTag = j;
                      tagsLoop = j + 1;
                      break;
                    }
                  }
                }
                if (response.success) {
                  if (serialNumber == null) serialNumber = '';
                  const modelReference = model.dataValues.id;
                  tags.push(newAssetTag);
                  const newInstrumentData = {
                    modelReference,
                    vendor,
                    modelNumber,
                    serialNumber,
                    comment,
                    calibrationFrequency,
                    description,
                    assetTag: newAssetTag,
                  };
                  // eslint-disable-next-line max-len
                  const created = await this.store.instruments.create(
                    newInstrumentData,
                    { transaction: t },
                  );
                  const instrumentId = created.dataValues.id;

                  // add calibration event if included
                  if (calibrationUser != null) {
                    await this.store.calibrationEvents.create(
                      {
                        calibrationHistoryIdReference: instrumentId,
                        user: calibrationUser,
                        date: calibrationDate,
                        comment: calibrationComment,
                      },
                      { transaction: t },
                    );
                  }
                  if (categories) {
                    for (let j = 0; j < categories.length; j += 1) {
                      // attach categories and create if they don't exist
                      const name = categories[j];
                      if (catMap.has(name.toLowerCase())) {
                        const instrumentCategoryId = catMap.get(name.toLowerCase());
                        await this.store.instrumentCategoryRelationships.create({
                          instrumentId,
                          instrumentCategoryId,
                        }, { transaction: t });
                      } else {
                        const createdCat = await this.store.instrumentCategories.create(
                          {
                            name,
                          },
                          { transaction: t },
                        );
                        const instrumentCategoryId = createdCat.dataValues.id;
                        catMap.set(name.toLowerCase(), instrumentCategoryId);
                        await this.store.instrumentCategoryRelationships.create({
                          instrumentId,
                          instrumentCategoryId,
                        }, { transaction: t });
                      }
                    }
                  }
                }
              } else {
                throw new Error(
                  `ERROR (type: model does not exist) (value: ${vendor} ${modelNumber})`,
                );
              }
            });
        }
      }
      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();
      response.message = 'Succesfully imported instruments';
      response.success = true;
      // eslint-disable-next-line no-unreachable
    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      response.success = false;
      if (error.errors) {
        response.message = `ERROR (type: ${error.errors[0].type}) (value: ${error.errors[0].value})`;
      } else {
        response.message = error.message;
      }
    }
    return JSON.stringify(response);
  }




















  /*
   * DEPRECATED, no longer in user as of ev 2
   */
  async bulkImportData({ models, instruments }) {
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
      await this.addInstruments(instruments).then(
        async (instrumentResponse) => {
          addedInstruments = instrumentResponse;
          if (instruments.length !== instrumentResponse.length) {
            anyError = true;
          }
        },
      );
    }

    if (anyError) {
      if (instruments != null) { await this.deleteAddedInstruments(instruments, addedInstruments); }
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
      if (
        (calibrationUser == null && calibrationDate != null)
        || (calibrationUser != null && calibrationDate == null)
      ) {
        this.response.errorList.push(
          `ERROR: (Malformed Input) Calibration event for instrument ${vendor} ${modelNumber} ${serialNumber} must have user and date`,
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      if (calibrationDate != null && !isValidDate(calibrationDate)) {
        this.response.errorList.push(
          `ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} Date must be in format YYYY-MM-DD`,
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      await this.store.models
        .findAll({ where: { modelNumber, vendor } })
        .then(async (model) => {
          if (model && model[0]) {
            await this.getInstrument({
              modelNumber,
              vendor,
              serialNumber,
            }).then(async (instrument) => {
              if (instrument) {
                this.response.errorList.push(
                  `ERROR: (Duplicate Input) Cannot add instrument ${vendor} ${modelNumber} ${serialNumber} already exists`,
                );
              } else {
                const modelReference = model[0].dataValues.id;
                // eslint-disable-next-line prefer-destructuring
                const {
                  description,
                  calibrationFrequency,
                } = model[0].dataValues;
                if (calibrationUser != null && calibrationFrequency < 1) {
                  this.response.errorList.push(
                    `ERROR: (Malformed Input) Instrument ${vendor} ${modelNumber} ${serialNumber} is not calibratable`,
                  );
                  return;
                }
                const isCalibratable = calibrationFrequency > 0;
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
            this.response.errorList.push(
              `ERROR: (Invalid Input) Cannot add instrument, model ${vendor} ${modelNumber} does not exist`,
            );
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
      await this.store.instruments.destroy({
        where: { modelNumber, vendor, serialNumber },
      });
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
          this.response.errorList.push(
            `ERROR (Duplicate Input) Model ${vendor} ${modelNumber} already exists!`,
          );
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
