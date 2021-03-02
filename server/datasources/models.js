/* eslint-disable no-await-in-loop */
// This file deals with what methods a model model should have
const { DataSource } = require('apollo-datasource');
const SQL = require('sequelize');

function validateModel({
  modelNumber = '', vendor = '', description = '', comment = '',
}) {
  if (vendor.length > 30) {
    return [false, 'Vendor input must be under 30 characters!'];
  }
  if (modelNumber.length > 40) {
    return [false, 'Model number must be under 40 characters!'];
  }
  if (description.length > 100) {
    return [false, 'Description input must be under 100 characters!'];
  }
  if (comment.length > 2000) {
    return [false, 'Comment input must be under 2000 characters!'];
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
    const model = await this.getModel({ modelNumber, vendor });
    const modelReference = model.dataValues.id;
    await this.store.instruments.findAll({ where: { modelReference } }).then(async (data) => {
      if (data && data[0]) {
        response.message = 'ERROR: Instrument is dependent on model!';
      } else {
        await this.store.models.destroy({ where: { modelNumber, vendor } });
        await this.store.modelCategoryRelationships.destroy({ where: { modelId: modelReference } });
        response.message = 'Model deleted!';
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
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const response = { message: '', success: false };
    const validation = validateModel({
      modelNumber, vendor, description, comment,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
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
          },
          { where: { id } },
        );
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
      }
    });
    return JSON.stringify(response);
  }

  async getAllModels({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const models = await this.store.models.findAll({ limit, offset });
    return models;
  }

  async countModelsWithFilter({
    vendor, modelNumber, description, categories, limit = null, offset = null,
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    let includeData;
    if (categories) {
      includeData = [
        {
          model: this.store.modelCategories,
          as: 'categories',
          through: 'modelCategoryRelationships',
          where: {
            name: categories,
          },
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
    if (vendor) {
      filters.push({
        vendor: SQL.where(
          SQL.fn('LOWER', SQL.col('vendor')),
          'LIKE',
          `%${vendor.toLowerCase()}%`,
        ),
      });
    }
    if (modelNumber) {
      filters.push({
        modelNumber: SQL.where(
          SQL.fn('LOWER', SQL.col('modelNumber')),
          'LIKE',
          `%${modelNumber.toLowerCase()}%`,
        ),
      });
    }
    if (description) {
      filters.push({
        description: SQL.where(
          SQL.fn('LOWER', SQL.col('description')),
          'LIKE',
          `%${description.toLowerCase()}%`,
        ),
      });
    }

    let models = await this.store.models.findAndCountAll({
      include: includeData,
      where: filters,
      limit,
      offset,
    });
    models = models.count;
    if (categories) {
      // eslint-disable-next-line prefer-const
      let modelsWithCategories = [];
      const checker = (arr, target) => target.every((v) => arr.includes(v));
      for (let i = 0; i < models.length; i += 1) {
        const hasCategories = models[i].dataValues.categories.map((a) => a.name);
        if (checker(hasCategories, categories)) {
          modelsWithCategories.push(models[i]);
        }
      }
      return modelsWithCategories.length;
    }
    return models;
  }

  async getModelsWithFilter({
    vendor, modelNumber, description, categories, limit = null, offset = null,
  }) {
    const storeModel = await this.store;
    this.store = storeModel;
    let includeData;
    if (categories) {
      includeData = [
        {
          model: this.store.modelCategories,
          as: 'categories',
          through: 'modelCategoryRelationships',
          where: {
            name: categories,
          },
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

    const models = await this.store.models.findAll({
      include: includeData,
      where: filters,
      limit,
      offset,
    });
    if (categories) {
      // eslint-disable-next-line prefer-const
      let modelsWithCategories = [];
      const checker = (arr, target) => target.every((v) => arr.includes(v));
      for (let i = 0; i < models.length; i += 1) {
        const hasCategories = models[i].dataValues.categories.map((a) => a.name);
        if (checker(hasCategories, categories)) {
          modelsWithCategories.push(models[i]);
        }
      }
      return modelsWithCategories;
    }
    return models;
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

  async getModel({ modelNumber, vendor }) {
    const storeModel = await this.store;
    this.store = storeModel;
    const model = await this.store.models.findAll({
      where: { modelNumber, vendor },
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
  }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
    const validation = validateModel({
      modelNumber, vendor, description, comment,
    });
    if (!validation[0]) {
      // eslint-disable-next-line prefer-destructuring
      response.message = validation[1];
      return JSON.stringify(response);
    }
    await this.getModel({ modelNumber, vendor }).then((value) => {
      if (value) {
        response.message = `Model ${vendor} ${modelNumber} already exists!`;
      } else {
        this.store.models.create({
          modelNumber,
          vendor,
          description,
          comment,
          calibrationFrequency,
        });
        response.message = `Added new model, ${vendor} ${modelNumber}, into the DB!`;
        response.success = true;
      }
    });
    return JSON.stringify(response);
  }

  async addModelCategory({ name }) {
    const response = { message: '', success: false };
    if (hasWhiteSpace(name)) {
      response.message = 'ERROR: category cannot have white spaces';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    await this.getModelCategory({ name }).then((value) => {
      if (value) {
        response.message = `ERROR: cannot add model category ${name}, it already exists!`;
      } else {
        this.store.modelCategories.create({
          name,
        });
        response.success = true;
        response.message = `Added new model category, ${name}, into the DB!`;
      }
    });
    return JSON.stringify(response);
  }

  async removeModelCategory({ name }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
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
    const response = { message: '', success: false };
    if (hasWhiteSpace(updatedName)) {
      response.message = 'ERROR: category cannot have white spaces';
      return JSON.stringify(response);
    }
    const storeModel = await this.store;
    this.store = storeModel;
    let name = currentName;
    await this.getModelCategory({ name }).then(async (value) => {
      if (value) {
        name = updatedName;
        // eslint-disable-next-line prefer-destructuring
        const id = value.dataValues.id;
        await this.getModelCategory({ name }).then((result) => {
          if (result) {
            response.message = `ERROR: Cannot change name to ${updatedName}, that category already exists!`;
          } else {
            this.store.modelCategories.update(
              {
                name: updatedName,
              },
              { where: { id } },
            );
            response.success = true;
            response.message = `Model category ${updatedName} successfully updated!`;
          }
        });
      } else {
        response.message = `ERROR: Cannot edit model category ${currentName}, it does not exist!`;
      }
    });
    return JSON.stringify(response);
  }

  async addCategoryToModel({ vendor, modelNumber, category }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
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

  async removeCategoryFromModel({ vendor, modelNumber, category }) {
    const response = { message: '', success: false };
    const storeModel = await this.store;
    this.store = storeModel;
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

  async getAllModelCategories({ limit = null, offset = null }) {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.modelCategories.findAll({ limit, offset });
  }

  async countModelCategories() {
    const storeModel = await this.store;
    this.store = storeModel;
    return await this.store.modelCategories.count();
  }
}

module.exports = ModelAPI;
