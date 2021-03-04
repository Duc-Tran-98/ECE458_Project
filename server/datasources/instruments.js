// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const SQL = require('sequelize');

function validateInstrument({
  modelNumber, vendor, serialNumber, comment, assetTag,
}) {
  if (vendor.length > 30) {
    return [false, 'Vendor input must be under 30 characters!'];
  }
  if (modelNumber.length > 40) {
    return [false, 'Model number input must be under 40 characters!'];
  }
  if (serialNumber.length > 40) {
    return [false, 'Serial number input must be under 40 characters!'];
  }
  if (comment != null && comment.length > 2000) {
    return [false, 'Comment input must be under 2000 characters!'];
  }
  if (Math.floor(assetTag / 100000) < 0 || Math.floor(assetTag / 100000) > 10) {
    return [false, 'Asset Tag not within 100000 - 999999'];
  }
  return [true];
}

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

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

  async getInstrumentsWithFilter({
    // eslint-disable-next-line max-len
    vendor, modelNumber, description, serialNumber, id, modelCategories, instrumentCategories, limit = null, offset = null,
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    // eslint-disable-next-line prefer-const
    let checkModelCategories;
    let checkInstrumentCategories;
    // eslint-disable-next-line prefer-const
    let includeData = [];
    if (modelCategories) {
      includeData.push({
        model: this.store.modelCategories,
        as: 'modelCategories',
        through: 'modelCategoryRelationships',
        where: {
          name: modelCategories,
        },
      });
      checkModelCategories = modelCategories;
    } else {
      includeData.push({
        model: this.store.modelCategories,
        as: 'modelCategories',
        through: 'modelCategoryRelationships',
      });
      checkModelCategories = [];
    }

    if (instrumentCategories) {
      includeData.push({
        model: this.store.instrumentCategories,
        as: 'instrumentCategories',
        through: 'instrumentCategoryRelationships',
        where: {
          name: instrumentCategories,
        },
      });
      checkInstrumentCategories = instrumentCategories;
    } else {
      includeData.push({
        model: this.store.instrumentCategories,
        as: 'instrumentCategories',
        through: 'instrumentCategoryRelationships',
      });
      checkInstrumentCategories = [];
    }

    includeData.push({
      model: this.store.calibrationEvents,
      as: 'recentCalibration',
      limit: 1,
      order: [['date', 'DESC']],
    });

    // eslint-disable-next-line prefer-const
    let filters = [];
    if (vendor) filters.push({ vendor: SQL.where(SQL.fn('LOWER', SQL.col('vendor')), 'LIKE', `%${vendor.toLowerCase()}%`) });
    if (modelNumber) filters.push({ modelNumber: SQL.where(SQL.fn('LOWER', SQL.col('modelNumber')), 'LIKE', `%${modelNumber.toLowerCase()}%`) });
    if (description) filters.push({ description: SQL.where(SQL.fn('LOWER', SQL.col('description')), 'LIKE', `%${description.toLowerCase()}%`) });
    if (serialNumber) filters.push({ serialNumber: SQL.where(SQL.fn('LOWER', SQL.col('serialNumber')), 'LIKE', `%${serialNumber.toLowerCase()}%`) });
    // eslint-disable-next-line max-len
    // if (assetTag) filters.push({ assetTag: SQL.where(SQL.fn('LOWER', SQL.col('assetTag')), 'LIKE', `%${assetTag.toLowerCase()}%`) });
    // ^^^ uncomment this once asset tag is implemented

    const instruments = await this.store.instruments.findAll({
      include: includeData,
      where: filters,
      limit,
      offset,
    });
    if (modelCategories || instrumentCategories) {
      const instrumentsWithCategories = [];
      const checker = (arr, target) => target.every((v) => arr.includes(v));
      for (let i = 0; i < instruments.length; i += 1) {
        const hasModelCategories = instruments[i].dataValues.modelCategories.map((a) => a.name);
        if (checker(hasModelCategories, checkModelCategories)) {
          // eslint-disable-next-line max-len
          const hasInstrumentCategories = instruments[i].dataValues.instrumentCategories.map((a) => a.name);
          if (checker(hasInstrumentCategories, checkInstrumentCategories)) {
            instrumentsWithCategories.push(instruments[i]);
          }
        }
      }
      return instrumentsWithCategories;
    }
    return instruments;
  }

  async getAllInstrumentsWithInfo({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instruments = await this.store.instruments.findAll({ limit, offset });
    const dataArray = [];
    for (let i = 0; i < instruments.length; i += 1) {
      const calibrationHistoryIdReference = instruments[i].dataValues.id;
      let calUser;
      let calDate;
      let calComment;
      if (instruments[i].dataValues.calibrationFrequency != null) {
        // eslint-disable-next-line no-await-in-loop
        const cal = await this.store.calibrationEvents.findAll({
          limit: 1,
          where: {
            calibrationHistoryIdReference,
          },
          order: [['date', 'DESC']],
        });
        calUser = cal[0].dataValues.user;
        calDate = cal[0].dataValues.date;
        calComment = cal[0].dataValues.comment;
      } else {
        calUser = null;
        calDate = null;
        calComment = null;
      }
      const data = {
        vendor: instruments[i].dataValues.vendor,
        modelNumber: instruments[i].dataValues.modelNumber,
        serialNumber: instruments[i].dataValues.serialNumber,
        modelReference: instruments[i].dataValues.modelReference,
        calibrationFrequency: instruments[i].dataValues.calibrationFrequency,
        comment: instruments[i].dataValues.comment,
        description: instruments[i].dataValues.description,
        id: instruments[i].dataValues.id,
        recentCalDate: calDate,
        recentCalUser: calUser,
        recentCalComment: calComment,
      };
      dataArray.push(data);
    }
    return dataArray;
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
      include: {
        model: this.store.instrumentCategories,
        as: 'instrumentCategories',
        through: 'instrumentCategoryRelationships',
      },
    });
    if (instrument && instrument[0]) {
      return instrument[0];
    }
    return null;
  }

  async editInstrument({
    modelNumber, vendor, serialNumber, comment, id, categories,
  }) {
    const response = { message: '', success: true };
    const validation = validateInstrument({
      modelNumber, vendor, serialNumber, comment,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { modelNumber, vendor },
    });
    if (model[0] == null) {
      response.message = 'ERROR: New model is not valid!';
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
      // eslint-disable-next-line prefer-destructuring
      const calibrationFrequency = model[0].dataValues.calibrationFrequency;
      // eslint-disable-next-line prefer-destructuring
      const description = model[0].dataValues.description;
      this.store.instruments.update(
        {
          modelNumber,
          vendor,
          serialNumber,
          description,
          calibrationFrequency,
          comment,
        },
        { where: { id } },
      );
      this.store.instrumentCategoryRelationships.destroy({
        where: {
          instrumentId: id,
        },
      });
      categories.forEach(async (category) => {
        await this.getInstrumentCategory({ name: category }).then((result) => {
          if (result) {
            const instrumentCategoryId = result.dataValues.id;
            this.store.instrumentCategoryRelationships.create({
              instrumentId: id,
              instrumentCategoryId,
            });
          }
        });
      });
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
    modelNumber, vendor, id = null, serialNumber, comment, categories = [],
  }) {
    const response = { message: '', success: true };
    const validation = validateInstrument({
      modelNumber, vendor, serialNumber, comment, id,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      response.success = false;
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.store.models
      .findOne({ where: { modelNumber, vendor } })
      .then(async (model) => {
        if (model) {
          await this.getInstrument({ modelNumber, vendor, serialNumber }).then(
            async (instrument) => {
              if (instrument) {
                response.message = `ERROR: Instrument ${vendor} ${modelNumber} ${serialNumber} already exists`;
                response.success = false;
              }
            },
          );
          if (id) {
            await this.store.instruments.findOne({ where: { id } }).then(
              (instrument) => {
                if (instrument) {
                  response.message = `ERROR: Instrument with Asset Tag ${id} already exists`;
                  response.success = false;
                }
              },
            );
          }
          if (response.success) {
            const modelReference = model.dataValues.id;
            const {
              description,
              calibrationFrequency,
            } = model.dataValues;
            let newInstrumentData;
            if (id) {
              newInstrumentData = {
                modelReference,
                vendor,
                modelNumber,
                serialNumber,
                comment,
                calibrationFrequency,
                description,
                id,
              };
            } else {
              newInstrumentData = {
                modelReference,
                vendor,
                modelNumber,
                serialNumber,
                comment,
                calibrationFrequency,
                description,
              };
            }
            const created = await this.store.instruments.create(newInstrumentData);
            const instrumentId = created.dataValues.id;
            categories.forEach(async (category) => {
              await this.getInstrumentCategory({ name: category }).then((result) => {
                if (result) {
                  const instrumentCategoryId = result.dataValues.id;
                  this.store.instrumentCategoryRelationships.create({
                    instrumentId,
                    instrumentCategoryId,
                  });
                }
              });
            });
            response.message = `Added new instrument ${vendor} ${modelNumber} ${serialNumber}!`;
            response.success = true;
          }
        } else {
          response.message = `ERROR: Model ${vendor} ${modelNumber} does not exist`;
          response.success = false;
        }
      });
    return JSON.stringify(response);
  }

  async addInstrumentCategory({ name }) {
    const response = { message: '', success: false };
    if (hasWhiteSpace(name)) {
      response.message = 'ERROR: category cannot have white spaces';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getInstrumentCategory({ name }).then((value) => {
      if (value) {
        response.message = `ERROR: cannot add instrument category ${name}, it already exists!`;
      } else {
        this.store.instrumentCategories.create({
          name,
        });
        response.success = true;
        response.message = `Added new instrument category, ${name}, into the DB!`;
      }
    });
    return JSON.stringify(response);
  }

  async removeInstrumentCategory({ name }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getInstrumentCategory({ name }).then((value) => {
      if (value) {
        this.store.instrumentCategories.destroy({
          where: {
            name,
          },
        });
        response.success = true;
        response.message = `Instrument category ${name} successfully deleted!`;
      } else {
        response.message = `ERROR: Cannot delete instrument category ${name}, it does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async editInstrumentCategory({ currentName, updatedName }) {
    const response = { message: '', success: false };
    if (hasWhiteSpace(updatedName)) {
      response.message = 'ERROR: category cannot have white spaces';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    let name = currentName;
    await this.getInstrumentCategory({ name }).then(async (value) => {
      if (value) {
        name = updatedName;
        // eslint-disable-next-line prefer-destructuring
        const id = value.dataValues.id;
        await this.getInstrumentCategory({ name }).then((result) => {
          if (result) {
            response.message = `ERROR: Cannot change name to ${updatedName}, that category already exists!`;
          } else {
            this.store.instrumentCategories.update(
              {
                name: updatedName,
              },
              { where: { id } },
            );
            response.success = true;
            response.message = `Instrument category ${updatedName} successfully updated!`;
          }
        });
      } else {
        response.message = `ERROR: Cannot edit instrument category ${currentName}, it does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async addCategoryToInstrument({
    vendor, modelNumber, serialNumber, category,
  }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getInstrument({ modelNumber, vendor, serialNumber }).then(async (value) => {
      if (value) {
        const name = category;
        await this.getInstrumentCategory({ name }).then((result) => {
          if (result) {
            const instrumentId = value.dataValues.id;
            const instrumentCategoryId = result.dataValues.id;
            this.store.instrumentCategoryRelationships.create({
              instrumentId,
              instrumentCategoryId,
            });
            response.success = true;
            response.message = `Category ${category} successfully added to instrument ${vendor} ${modelNumber} ${serialNumber}!`;
          } else {
            response.message = `ERROR: Cannot add category ${category}, to instrument because it does not exist!`;
          }
        });
      } else {
        response.message = `ERROR: cannot add category beacuse instrument ${vendor} ${modelNumber} ${serialNumber}, does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async removeCategoryFromInstrument({
    vendor, modelNumber, serialNumber, category,
  }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getInstrument({ modelNumber, vendor, serialNumber }).then(async (value) => {
      if (value) {
        const name = category;
        await this.getInstrumentCategory({ name }).then(async (result) => {
          if (result) {
            const instrumentId = value.dataValues.id;
            const instrumentCategoryId = result.dataValues.id;
            const attached = await this.store.instrumentCategoryRelationships.findAll({
              where: {
                instrumentId,
                instrumentCategoryId,
              },
            });
            if (attached && attached[0]) {
              await this.store.instrumentCategoryRelationships.destroy({
                where: {
                  instrumentId,
                  instrumentCategoryId,
                },
              });
              response.success = true;
              response.message = `Category ${category} successfully removed from instrument ${vendor} ${modelNumber} ${serialNumber}!`;
            } else {
              response.message = `ERROR: category ${category} was not attached to instrument ${vendor} ${modelNumber} ${serialNumber}!`;
            }
          } else {
            response.message = `ERROR: Cannot remove category ${category}, from instrument because category does not exist!`;
          }
        });
      } else {
        response.message = `ERROR: cannot remove category beacuse instrument ${vendor} ${modelNumber} ${serialNumber}, does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async getInstrumentCategory({ name }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const category = await this.store.instrumentCategories.findAll({
      where: { name },
    });
    if (category && category[0]) {
      return category[0];
    }
    return null;
  }

  async getAllInstrumentCategories({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.instrumentCategories.findAll({ limit, offset });
  }

  async countInstrumentCategories() {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.instrumentCategories.count();
  }
}

module.exports = InstrumentAPI;
