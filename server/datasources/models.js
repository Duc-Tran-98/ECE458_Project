/* eslint-disable no-await-in-loop */
// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const SQL = require('sequelize');

function validateModel({
  modelNumber = '', vendor = '', description = '', comment = '', klufe = false, loadBank = false, custom = false,
}) {
  if (vendor.length > 30) {
    return [false, 'ERROR: Vendor input must be under 30 characters!'];
  }
  if (modelNumber.length > 40) {
    return [false, 'ERROR: Model number must be under 40 characters!'];
  }
  if (description.length > 100) {
    return [false, 'ERROR: Description input must be under 100 characters!'];
  }
  if (vendor.length < 1) {
    return [false, 'ERROR: Vendor input must be included!'];
  }
  if (modelNumber.length < 1) {
    return [false, 'ERROR: Model number must be included!'];
  }
  if (description.length < 1) {
    return [false, 'ERROR: Description input must be included!'];
  }
  if (comment != null && comment.length > 2000) {
    return [false, 'ERROR: Comment input must be under 2000 characters!'];
  }
  let count = 0;
  if (klufe) count += 1;
  if (loadBank) count += 1;
  if (custom) count += 1;
  if (count > 1) {
    return [false, 'ERROR: Model can only support one of load bank wizard, klufe wizard, or custom form!'];
  }
  return [true];
}

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

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

  checkPermissions() {
    const { user } = this.context;
    if (process.env.NODE_ENV.includes('dev')) {
      return true;
    }
    return user.isAdmin || user.modelPermission;
  }

  async countAllModels() {
    const storeModel = await this.store;
    this.store = storeModel;
    let total = await this.store.models.findAndCountAll();
    total = total.count;
    return total;
  }

  async deleteModel({ modelNumber, vendor }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    const model = await this.getModel({ modelNumber, vendor });
    const modelReference = model.dataValues.id;
    await this.store.instruments.findAll({ where: { modelReference } }).then(async (data) => {
      if (data && data[0]) {
        response.message = 'ERROR: Instrument is dependent on model!';
      } else {
        await this.store.models.destroy({ where: { modelNumber, vendor } });
        await this.store.modelCategoryRelationships.destroy({ where: { modelId: modelReference } });
        // eslint-disable-next-line max-len
        await this.store.calibratorCategoryRelationships.destroy({ where: { modelId: modelReference } });
        response.message = `Deleted model ${vendor}-${modelNumber}`;
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
    requiresCalibrationApproval,
    supportCustomCalibration,
    supportLoadBankCalibration,
    supportKlufeCalibration,
    customForm,
    categories,
    calibratorCategories,
  }) {
    const response = { message: '', success: false, model: null };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission';
      return response;
    }
    const validation = validateModel({
      // eslint-disable-next-line max-len
      modelNumber, vendor, description, comment, klufe: supportKlufeCalibration, loadBank: supportLoadBankCalibration, custom: supportCustomCalibration,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return response;
    }
    if (typeof id === 'string') {
      // eslint-disable-next-line no-param-reassign
      id = parseInt(id, 10);
    }
    await this.getModel({ modelNumber, vendor }).then(async (value) => {
      if (value && value.id !== id) {
        response.message = 'That model number and vendor pair already exists!';
      } else {
        this.store.models.update(
          {
            modelNumber,
            vendor,
            description,
            comment,
            calibrationFrequency,
            requiresCalibrationApproval,
            supportCustomCalibration,
            customForm,
            supportLoadBankCalibration,
            supportKlufeCalibration,
          },
          { where: { id } },
        );
        this.store.modelCategoryRelationships.destroy({
          where: {
            modelId: id,
          },
        });
        categories.forEach(async (category) => {
          await this.addCategoryToModel({ vendor, modelNumber, category });
        });
        this.store.calibratorCategoryRelationships.destroy({
          where: {
            modelId: id,
          },
        });
        calibratorCategories.forEach(async (category) => {
          await this.addCalibratorCategoryToModel({ vendor, modelNumber, category });
        });
        const modelReference = id;
        const instrumentList = await this.store.instruments.findAll({
          where: { modelReference },
        });
        // console.log(instrumentList);
        for (let i = 0; i < instrumentList.length; i += 1) {
          await this.store.instruments.update(
            {
              modelNumber,
              vendor,
              description,
              calibrationFrequency,
            },
            { where: { id: instrumentList[i].dataValues.id } },
          );
        }
        response.message = 'Model Updated Successfully!';
        response.success = true;
        response.model = await this.getModelById({ id });
      }
    });
    return response;
  }

  async getAllModels({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll({
      limit,
      offset,
      include: {
        model: this.store.modelCategories,
        as: 'categories',
        through: 'modelCategoryRelationships',
      },
    });
    return models;
  }

  async getModelsWithFilter({
    vendor, modelNumber, description, categories, limit = null, offset = null, orderBy = [['id', 'ASC']],
  }) {
    const response = { models: [], total: 0 };
    const storeModel = await this.store;
    this.store = storeModel;
    if (categories) {
      let includeData;
      if (categories) {
        includeData = [
          {
            model: this.store.modelCategories,
            as: 'categories',
            through: 'modelCategoryRelationships',
            // where: {
            //   name: categories,
            // },
          },
        ];
      } else {
        includeData = [
          {
            model: this.store.modelCategories,
            as: 'categories',
            through: 'modelCategoryRelationships',
          },
        ];
      }

      // eslint-disable-next-line prefer-const
      let filters = [];
      if (vendor) filters.push({ vendor: SQL.where(SQL.fn('LOWER', SQL.col('vendor')), 'LIKE', `%${vendor.toLowerCase()}%`) });
      if (modelNumber) filters.push({ modelNumber: SQL.where(SQL.fn('LOWER', SQL.col('modelNumber')), 'LIKE', `%${modelNumber.toLowerCase()}%`) });
      if (description) filters.push({ description: SQL.where(SQL.fn('LOWER', SQL.col('description')), 'LIKE', `%${description.toLowerCase()}%`) });

      let models = await this.store.models.findAndCountAll({
        include: includeData,
        where: filters,
        order: orderBy,
      });
      response.models = models.rows;
      response.total = models.count;
      models = models.rows;

      // eslint-disable-next-line prefer-const
      let modelsWithCategories = [];
      const checker = (arr, target) => target.every((v) => arr.includes(v));
      for (let i = 0; i < models.length; i += 1) {
        const hasCategories = models[i].dataValues.categories.map((a) => a.name);
        if (checker(hasCategories, categories)) {
          modelsWithCategories.push(models[i]);
        }
      }
      response.total = modelsWithCategories.length;
      if (limit > 0 && response.total > limit) {
        // eslint-disable-next-line no-param-reassign
        if (offset === null) offset = 0;
        modelsWithCategories = modelsWithCategories.slice(offset, offset + limit);
      }
      response.models = modelsWithCategories;
    } else {
      const includeData = [
        {
          model: this.store.modelCategoryRelationships,
          as: 'mtmcr',
          separate: true,
          include: [
            {
              model: this.store.modelCategories,
              as: 'mcrtmc',
            },
          ],
        },
      ];

      // eslint-disable-next-line prefer-const
      let filters = [];
      if (vendor) filters.push({ vendor: SQL.where(SQL.fn('LOWER', SQL.col('vendor')), 'LIKE', `%${vendor.toLowerCase()}%`) });
      if (modelNumber) filters.push({ modelNumber: SQL.where(SQL.fn('LOWER', SQL.col('modelNumber')), 'LIKE', `%${modelNumber.toLowerCase()}%`) });
      if (description) filters.push({ description: SQL.where(SQL.fn('LOWER', SQL.col('description')), 'LIKE', `%${description.toLowerCase()}%`) });

      let models = await this.store.models.findAndCountAll({
        include: includeData,
        where: filters,
        limit,
        offset,
        subQuery: false,
        order: orderBy,
      });
      for (let j = 0; j < models.rows.length; j += 1) {
        const mtmcr = models.rows[j].mtmcr.map((a) => a.dataValues);
        let cats = [];
        for (let i = 0; i < mtmcr.length; i += 1) {
          cats = [...cats, mtmcr[i].mcrtmc.dataValues.name];
        }
        // eslint-disable-next-line prefer-const
        let modelWithCats = { arr: [] };
        for (let i = 0; i < cats.length; i += 1) {
          modelWithCats.arr.push({
            name: cats[i],
          });
        }
        models.rows[j].categories = modelWithCats.arr;
      }
      response.models = models.rows;
      response.total = models.count;
      models = models.rows;

      if (categories) {
        models = await this.store.models.findAndCountAll({
          include: includeData,
          where: filters,
          subQuery: false,
          order: orderBy,
        });
        for (let j = 0; j < models.rows.length; j += 1) {
          const mtmcr = models.rows[j].mtmcr.map((a) => a.dataValues);
          let cats = [];
          for (let i = 0; i < mtmcr.length; i += 1) {
            cats = [...cats, mtmcr[i].mcrtmc.dataValues.name];
          }
          // eslint-disable-next-line prefer-const
          let modelWithCats = { arr: [] };
          for (let i = 0; i < cats.length; i += 1) {
            modelWithCats.arr.push({
              name: cats[i],
            });
          }
          models.rows[j].categories = modelWithCats.arr;
        }
        response.models = models.rows;
        response.total = models.count;
        models = models.rows;
        // eslint-disable-next-line prefer-const
        let modelsWithCategories = [];
        const checker = (arr, target) => target.every((v) => arr.has(v));
        for (let i = 0; i < models.length; i += 1) {
          const set = new Set();
          models[i].categories.map((a) => set.add(a.name));
          if (checker(set, categories)) {
            modelsWithCategories.push(models[i]);
          }
        }
        response.total = modelsWithCategories.length;
        if (limit > 0 && response.total > limit) {
        // eslint-disable-next-line no-param-reassign
          if (offset === null) offset = 0;
          modelsWithCategories = modelsWithCategories.slice(offset, offset + limit);
        }
        response.models = modelsWithCategories;
      }
    }
    return response;
  }

  async getAllModelsWithModelNum({ modelNumber }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll({ where: { modelNumber } });
    return models;
  }

  async getAllModelsWithVendor({ vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll({ where: { vendor } });
    return models;
  }

  async getUniqueVendors() {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll({ attributes: [[SQL.fn('DISTINCT', SQL.col('vendor')), 'vendor']] });
    return models;
  }

  async getModelById({ id }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { id },
      include: [{
        model: this.store.modelCategories,
        as: 'categories',
        through: 'modelCategoryRelationships',
      }, {
        model: this.store.modelCategories,
        as: 'calibratorCategories',
        through: 'calibratorCategoryRelationships',
      }],
    });
    if (model && model[0]) {
      return model[0];
    }
    return null;
  }

  async getModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { modelNumber, vendor },
      include: [{
        model: this.store.modelCategories,
        as: 'categories',
        through: 'modelCategoryRelationships',
      }, {
        model: this.store.modelCategories,
        as: 'calibratorCategories',
        through: 'calibratorCategoryRelationships',
      }],
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
    requiresCalibrationApproval = false,
    supportLoadBankCalibration = false,
    supportKlufeCalibration = false,
    supportCustomCalibration = false,
    customForm,
    categories = [],
    calibratorCategories = [],
  }) {
    const response = { message: '', success: false, model: null };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return response;
    }
    const validation = validateModel({
      // eslint-disable-next-line max-len
      modelNumber, vendor, description, comment, klufe: supportKlufeCalibration, loadBank: supportLoadBankCalibration, custom: supportCustomCalibration,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return response;
    }
    await this.getModel({ modelNumber, vendor }).then(async (value) => {
      if (value) {
        response.message = `Model ${vendor} ${modelNumber} already exists!`;
      } else {
        await this.store.models.create({
          modelNumber,
          vendor,
          description,
          comment,
          calibrationFrequency,
          requiresCalibrationApproval,
          supportCustomCalibration,
          customForm,
          supportLoadBankCalibration,
          supportKlufeCalibration,
        });
        categories.forEach(async (category) => {
          await this.addCategoryToModel({ vendor, modelNumber, category });
        });
        console.log('cal cat');
        console.log(calibratorCategories);
        calibratorCategories.forEach(async (category) => {
          await this.addCalibratorCategoryToModel({ vendor, modelNumber, category });
        });
        response.message = `Added new model, ${vendor} ${modelNumber}, into the DB!`;
        response.success = true;
        response.model = await this.getModel({ modelNumber, vendor });
      }
    });
    return response;
  }

  async addModelCategory({ name }) {
    const response = { message: '', success: false, category: null };
    if (hasWhiteSpace(name)) {
      response.message = 'ERROR: category cannot have white spaces';
      return response;
    }
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return response;
    }
    await this.getModelCategory({ name }).then(async (value) => {
      if (value) {
        response.message = `ERROR: cannot add model category ${name}, it already exists!`;
      } else {
        await this.store.modelCategories.create({
          name,
        });
        response.success = true;
        response.message = `Added new model category, ${name}, into the DB!`;
        response.category = await this.getModelCategory({ name });
      }
    });
    return response;
  }

  async removeModelCategory({ name }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    await this.getModelCategory({ name }).then((value) => {
      if (value) {
        this.store.modelCategories.destroy({
          where: {
            name,
          },
        });
        const modelCategoryId = value.dataValues.id;
        this.store.modelCategoryRelationships.destroy({
          where: {
            modelCategoryId,
          },
        });
        response.success = true;
        response.message = `Model category ${name} successfully deleted!`;
      } else {
        response.message = `ERROR: Cannot delete model category ${name}, it does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async editModelCategory({ currentName, updatedName }) {
    const response = { message: '', success: false, category: null };
    if (hasWhiteSpace(updatedName)) {
      response.message = 'ERROR: category cannot have white spaces';
      return response;
    }
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return response;
    }
    let name = currentName;
    await this.getModelCategory({ name }).then(async (value) => {
      if (value) {
        name = updatedName;
        // eslint-disable-next-line prefer-destructuring
        const id = value.dataValues.id;
        await this.getModelCategory({ name }).then(async (result) => {
          if (result) {
            response.message = `ERROR: Cannot change name to ${updatedName}, that category already exists!`;
          } else {
            await this.store.modelCategories.update(
              {
                name: updatedName,
              },
              { where: { id } },
            );
            response.success = true;
            response.message = `Model category ${updatedName} successfully updated!`;
            response.category = await this.getModelCategory({ name: updatedName });
          }
        });
      } else {
        response.message = `ERROR: Cannot edit model category ${currentName}, it does not exist!`;
      }
    });
    return response;
  }

  async addCategoryToModel({ vendor, modelNumber, category }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    await this.getModel({ modelNumber, vendor }).then(async (value) => {
      if (value) {
        const name = category;
        await this.getModelCategory({ name }).then((result) => {
          if (result) {
            const modelId = value.dataValues.id;
            const modelCategoryId = result.dataValues.id;
            this.store.modelCategoryRelationships.create({
              modelId,
              modelCategoryId,
            });
            response.success = true;
            response.message = `Category ${category} successfully added to model ${vendor} ${modelNumber}!`;
          } else {
            response.message = `ERROR: Cannot add category ${category}, to model because it does not exist!`;
          }
        });
      } else {
        response.message = `ERROR: cannot add category beacuse model ${vendor} ${modelNumber}, does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async addCalibratorCategoryToModel({ vendor, modelNumber, category }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission.';
      return JSON.stringify(response);
    }
    await this.getModel({ modelNumber, vendor }).then(async (value) => {
      if (value) {
        const name = category;
        await this.getModelCategory({ name }).then((result) => {
          if (result) {
            const modelId = value.dataValues.id;
            const modelCategoryId = result.dataValues.id;
            this.store.calibratorCategoryRelationships.create({
              modelId,
              modelCategoryId,
            });
            response.success = true;
            response.message = `Calibrator Category ${category} successfully added to model ${vendor} ${modelNumber}!`;
          } else {
            response.message = `ERROR: Cannot add category ${category}, to model because it does not exist!`;
          }
        });
      } else {
        response.message = `ERROR: cannot add category beacuse model ${vendor} ${modelNumber}, does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async removeCategoryFromModel({ vendor, modelNumber, category }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    if (!this.checkPermissions()) {
      response.message = 'ERROR: User does not have permission';
      return JSON.stringify(response);
    }
    await this.getModel({ modelNumber, vendor }).then(async (value) => {
      if (value) {
        const name = category;
        await this.getModelCategory({ name }).then(async (result) => {
          if (result) {
            const modelId = value.dataValues.id;
            const modelCategoryId = result.dataValues.id;
            const attached = await this.store.modelCategoryRelationships.findAll({
              where: {
                modelId,
                modelCategoryId,
              },
            });
            if (attached && attached[0]) {
              await this.store.modelCategoryRelationships.destroy({
                where: {
                  modelId,
                  modelCategoryId,
                },
              });
              response.success = true;
              response.message = `Category ${category} successfully removed from model ${vendor} ${modelNumber}!`;
            } else {
              response.message = `ERROR: category ${category} was not attached to model ${vendor} ${modelNumber}!`;
            }
          } else {
            response.message = `ERROR: Cannot remove category ${category}, from model because category does not exist!`;
          }
        });
      } else {
        response.message = `ERROR: cannot remove category beacuse model ${vendor} ${modelNumber}, does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async getModelCategory({ name }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const category = await this.store.modelCategories.findAll({
      where: { name },
    });
    if (category && category[0]) {
      return category[0];
    }
    return null;
  }

  async getAllModelCategories({ limit = null, offset = null, orderBy = [['name', 'ASC']] }) {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.modelCategories.findAll({
      limit,
      offset,
      order: orderBy,
    });
  }

  async countModelCategories() {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.modelCategories.count();
  }

  async countModelsAttachedToCategory({ name }) {
    const storeModel = await this.store;
    this.store = storeModel;
    let response = 0;
    await this.getModelCategory({ name }).then(async (result) => {
      if (result) {
        const modelCategoryId = result.dataValues.id;
        const attached = await this.store.modelCategoryRelationships.count({
          where: { modelCategoryId },
        });
        response = attached;
      } else {
        console.log('category deos not exist');
      }
    });
    return response;
  }
}

module.exports = ModelAPI;
