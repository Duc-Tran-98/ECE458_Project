// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const SQL = require('sequelize');

function validateInstrument({
  modelNumber, vendor, serialNumber, comment,
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
  if (comment.length > 2000) {
    return [false, 'Comment input must be under 2000 characters!'];
  }
  return [true];
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
    vendor, modelNumber, description, serialNumber, assetTag, modelCategories, instrumentCategories, limit = null, offset = null,
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

  async addInstrumentCategory({ name }) {
    console.log(`add instrument category ${name}`);
    const storeModel = await this.store;
    this.store = storeModel;
  }

  async removeInstrumentCategory({ name }) {
    console.log(`remove instrument category ${name}`);
    const storeModel = await this.store;
    this.store = storeModel;
  }

  async editInstrumentCategory({ currentName, updatedName }) {
    console.log(`edit instrument category ${currentName} to ${updatedName}`);
    const storeModel = await this.store;
    this.store = storeModel;
  }

  async addCategoryToInstrument({
    vendor, modelNumber, serialNumber, category,
  }) {
    console.log(`add ${category} to instrument ${vendor} ${modelNumber} ${serialNumber}`);
    const storeModel = await this.store;
    this.store = storeModel;
  }

  async removeCategoryFromInstrument({
    vendor, modelNumber, serialNumber, category,
  }) {
    console.log(`remove ${category} from instrument ${vendor} ${modelNumber} ${serialNumber}`);
    const storeModel = await this.store;
    this.store = storeModel;
  }
}

module.exports = InstrumentAPI;
