/* eslint-disable max-len */
// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const SQL = require('sequelize');
const runBarcode = require('./barcodeGenerator');

function validateInstrument({
  modelNumber, vendor, serialNumber, comment, assetTag,
}) {
  if (vendor.length > 30) {
    return [false, 'Vendor input must be under 30 characters!'];
  }
  if (modelNumber.length > 40) {
    return [false, 'Model number input must be under 40 characters!'];
  }
  if (serialNumber != null && serialNumber.length > 40) {
    return [false, 'Serial number input must be under 40 characters!'];
  }
  if (comment != null && comment.length > 2000) {
    return [false, 'Comment input must be under 2000 characters!'];
  }
  // eslint-disable-next-line max-len
  if (assetTag != null && (Math.floor(assetTag / 100000) < 1 || Math.floor(assetTag / 100000) > 10)) {
    return [false, 'Asset Tag not within 100000 - 999999 Range'];
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

  checkPermission() {
    const { user } = this.context;
    return user.isAdmin || user.instrumentPermission;
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
    const response = { instruments: [], total: 0 };

    if (modelCategories || instrumentCategories) {
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
      if (assetTag) filters.push({ assetTag });

      let instruments = await this.store.instruments.findAndCountAll({
        include: includeData,
        where: filters,
        order: [
          ['assetTag', 'ASC'],
        ],
      });
      response.instruments = instruments.rows;
      response.total = instruments.count;
      instruments = instruments.rows;
      if (modelCategories || instrumentCategories) {
        let instrumentsWithCategories = [];
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
        response.total = instrumentsWithCategories.length;
        if (limit > 0 && response.total > limit) {
          // eslint-disable-next-line no-param-reassign
          if (offset === null) offset = 0;
          instrumentsWithCategories = instrumentsWithCategories.slice(offset, offset + limit);
        }
        response.instruments = instrumentsWithCategories;
      }
    } else {
    // eslint-disable-next-line prefer-const
      let includeData = [];
      includeData.push({
        subQuery: false,
        model: this.store.modelCategoryRelationships,
        separate: true,
        as: 'itmcr',
        include: [
          {
            model: this.store.modelCategories,
            as: 'mcrtmc',
          },
        ],
      });

      includeData.push({
        subQuery: false,
        model: this.store.instrumentCategoryRelationships,
        separate: true,
        as: 'iticr',
        include: [
          {
            model: this.store.instrumentCategories,
            as: 'icrtic',
          },
        ],
      });

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
      if (assetTag) filters.push({ assetTag });

      let lim = limit;
      let off = offset;
      if (modelCategories || instrumentCategories) {
      // eslint-disable-next-line no-param-reassign
        lim = null;
        // eslint-disable-next-line no-param-reassign
        off = null;
      }
      let instruments = await this.store.instruments.findAndCountAll({
        include: includeData,
        where: filters,
        order: [
          ['assetTag', 'ASC'],
        ],
        subQuery: false,
        limit: lim,
        offset: off,
      });
      for (let j = 0; j < instruments.rows.length; j += 1) {
        const itmcr = instruments.rows[j].itmcr.map((a) => a.dataValues);
        let cats = [];
        for (let i = 0; i < itmcr.length; i += 1) {
          cats = [...cats, itmcr[i].mcrtmc.dataValues.name];
        }
        // eslint-disable-next-line prefer-const
        let instWithCats = { arr: [] };
        for (let i = 0; i < cats.length; i += 1) {
          instWithCats.arr.push({
            name: cats[i],
          });
        }
        instruments.rows[j].modelCategories = instWithCats.arr;
      }

      for (let j = 0; j < instruments.rows.length; j += 1) {
        const iticr = instruments.rows[j].iticr.map((a) => a.dataValues);
        let cats = [];
        for (let i = 0; i < iticr.length; i += 1) {
          cats = [...cats, iticr[i].icrtic.dataValues.name];
        }
        // eslint-disable-next-line prefer-const
        let instWithCats = { arr: [] };
        for (let i = 0; i < cats.length; i += 1) {
          instWithCats.arr.push({
            name: cats[i],
          });
        }
        instruments.rows[j].instrumentCategories = instWithCats.arr;
      }

      response.instruments = instruments.rows;
      response.total = instruments.count;
      instruments = response.instruments;
    }

    return response;
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
        assetTag: instruments[i].dataValues.assetTag,
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
    const instrument = await this.store.instruments.findOne({
      where: { modelNumber, vendor, serialNumber },
      include: {
        model: this.store.instrumentCategories,
        as: 'instrumentCategories',
        through: 'instrumentCategoryRelationships',
      },
    });
    let instrumentInfo = null;
    if (instrument) {
      await this.store.models.findOne({ where: { modelNumber, vendor } }).then((model) => {
        instrumentInfo = {
          vendor: instrument.dataValues.vendor,
          modelNumber: instrument.dataValues.modelNumber,
          serialNumber: instrument.dataValues.serialNumber,
          modelReference: instrument.dataValues.modelReference,
          calibrationFrequency: instrument.dataValues.calibrationFrequency,
          instrumentCategories: instrument.dataValues.instrumentCategories,
          comment: instrument.dataValues.comment,
          description: instrument.dataValues.description,
          id: instrument.dataValues.id,
          assetTag: instrument.dataValues.assetTag,
          supportLoadBankCalibration: model.dataValues.supportLoadBankCalibration,
          supportKlufeCalibration: model.dataValues.supportKlufeCalibration,
        };
      });
    }
    return instrumentInfo;
  }

  async getInstrumentByAssetTag({ assetTag }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const instrument = await this.store.instruments.findOne({
      where: { assetTag },
      include: {
        model: this.store.instrumentCategories,
        as: 'instrumentCategories',
        through: 'instrumentCategoryRelationships',
      },
    });
    let instrumentInfo = null;
    if (instrument) {
      const modRef = instrument.dataValues.modelReference;
      await this.store.models.findOne({ where: { id: modRef } }).then((model) => {
        instrumentInfo = {
          vendor: instrument.dataValues.vendor,
          modelNumber: instrument.dataValues.modelNumber,
          serialNumber: instrument.dataValues.serialNumber,
          modelReference: instrument.dataValues.modelReference,
          calibrationFrequency: instrument.dataValues.calibrationFrequency,
          instrumentCategories: instrument.dataValues.instrumentCategories,
          comment: instrument.dataValues.comment,
          description: instrument.dataValues.description,
          id: instrument.dataValues.id,
          assetTag: instrument.dataValues.assetTag,
          supportLoadBankCalibration: model.dataValues.supportLoadBankCalibration,
          supportKlufeCalibration: model.dataValues.supportKlufeCalibration,
        };
        return instrumentInfo;
      });
    }
    return instrumentInfo;
  }

  async editInstrument({
    modelNumber, vendor, serialNumber, comment, assetTag, id, categories = [],
  }) {
    const response = { message: '', success: true };
    const validation = validateInstrument({
      modelNumber, vendor, serialNumber, comment, assetTag,
    });
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      response.success = false;
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
        if (element.serialNumber === serialNumber && serialNumber !== '' && element.id !== id) {
          response.message = `ERROR: The instrument ${vendor} ${modelNumber} ${serialNumber} already exists!`;
          response.success = false;
        } // check that there are no unique conflicts, but exclude ourselves
      });
    }
    await this.store.instruments.findOne({ where: { assetTag } }).then(
      (instrument) => {
        if (instrument) {
          if (instrument.dataValues.assetTag === assetTag && instrument.dataValues.id !== id) {
            response.message = `ERROR: Instrument with Asset Tag ${assetTag} already exists!`;
            response.success = false;
          }
        }
      },
    );
    if (response.success) {
      // eslint-disable-next-line prefer-destructuring
      const calibrationFrequency = model[0].dataValues.calibrationFrequency;
      const modelReference = model[0].dataValues.id;
      // eslint-disable-next-line prefer-destructuring
      const description = model[0].dataValues.description;
      this.store.instruments.update(
        {
          modelReference,
          modelNumber,
          vendor,
          serialNumber,
          description,
          calibrationFrequency,
          comment,
          assetTag,
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
      response.message = 'Successfully Editted Instrument!';
    }
    return JSON.stringify(response);
  }

  async deleteInstrument({ id }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    await this.store.instruments.destroy({ where: { id } });
    await this.store.calibrationEvents.destroy({
      where: { calibrationHistoryIdReference: id },
    });
    response.message = `Deleted Instrument with ID: ${id}`;
    response.success = true;
    return JSON.stringify(response);
  }

  async addInstrument({
    modelNumber, vendor, assetTag = null, serialNumber, comment, categories = [],
  }) {
    const response = { message: '', success: true, assetTag: 0 };
    const validation = validateInstrument({
      modelNumber, vendor, serialNumber, comment, assetTag,
    });
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
          if (serialNumber) {
            await this.getInstrument({ modelNumber, vendor, serialNumber }).then(
              async (instrument) => {
                if (instrument) {
                  response.message = `ERROR: Instrument ${vendor} ${modelNumber} ${serialNumber} already exists`;
                  response.assetTag = -1;
                  response.success = false;
                }
              },
            );
          }
          let newAssetTag;
          if (assetTag) {
            await this.store.instruments.findOne({ where: { assetTag } }).then(
              (instrument) => {
                if (instrument) {
                  response.message = `ERROR: Instrument with Asset Tag ${assetTag} already exists`;
                  response.assetTag = -1;
                  response.success = false;
                } else {
                  newAssetTag = assetTag;
                  response.assetTag = newAssetTag;
                }
              },
            );
          } else {
            newAssetTag = Math.floor(Math.random() * 900000) + 100000;
            // eslint-disable-next-line max-len
            let instrumentCheck = await this.store.instruments.findOne({ where: { assetTag: newAssetTag } });
            while (instrumentCheck != null) {
              newAssetTag = Math.floor(Math.floor(Math.random() * 900000) + 100000);
              // eslint-disable-next-line no-await-in-loop
              instrumentCheck = await this.store.instrument.findOne({ where: { newAssetTag } });
            }
          }
          if (response.success) {
            const modelReference = model.dataValues.id;
            const {
              description,
              calibrationFrequency,
            } = model.dataValues;
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
            response.assetTag = newAssetTag;
            response.success = true;
          }
        } else {
          response.message = `ERROR: Model ${vendor} ${modelNumber} does not exist`;
          response.assetTag = -1;
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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
    if (!this.checkPermission()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
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

  async countInstrumentsAttachedToCategory({ name }) {
    const storeModel = await this.store;
    this.store = storeModel;
    let response = 0;
    await this.getInstrumentCategory({ name }).then(async (result) => {
      if (result) {
        const instrumentCategoryId = result.dataValues.id;
        const attached = await this.store.instrumentCategoryRelationships.count({
          where: { instrumentCategoryId },
        });
        response = attached;
      } else {
        console.log('category deos not exist');
      }
    });
    return response;
  }
}

module.exports = InstrumentAPI;
