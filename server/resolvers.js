/* eslint-disable max-len */
// Resolvers define the technique for fetching the types defined in the
// schema.
const bcrypt = require('bcryptjs');
// For hashing password
const saltRounds = 10;
module.exports = {
  Query: {
    // User Queries
    // eslint-disable-next-line max-len
    getUser: async (_, { userName }, { dataSources }) => await dataSources.userAPI.findUser({ userName }),
    isAdmin: (_, { userName }, { dataSources }) => dataSources.userAPI.isAdmin({ userName }),
    getAllUsers: async (_, { limit, offset }, { dataSources }) => await dataSources.userAPI.getAllUsers({ limit, offset }),
    countAllUsers: async (_, __, { dataSources }) => await dataSources.userAPI.countAllUsers(),

    // Model Queries
    countAllModels: async (_, __, { dataSources }) => await dataSources.modelAPI.countAllModels(),
    // eslint-disable-next-line max-len
    getAllModels: (_, { limit, offset }, { dataSources }) => dataSources.modelAPI.getAllModels({ limit, offset }),
    // eslint-disable-next-line max-len
    getAllModelsWithModelNum: async (_, { modelNumber }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithModelNum({ modelNumber }),
    // eslint-disable-next-line max-len
    getAllModelsWithVendor: async (_, { vendor }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithVendor({ vendor }),
    // eslint-disable-next-line max-len
    getModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.getModel({ modelNumber, vendor }),
    // eslint-disable-next-line max-len
    getModelsWithFilter: async (
      _,
      {
        vendor, modelNumber, description, categories, limit, offset,
      },
      { dataSources },
    ) => await dataSources.modelAPI.getModelsWithFilter({
      vendor,
      modelNumber,
      description,
      categories,
      limit,
      offset,
    }),

    // eslint-disable-next-line max-len
    getUniqueVendors: async (_, __, { dataSources }) => await dataSources.modelAPI.getUniqueVendors(),
    // Instrument Queries
    // eslint-disable-next-line max-len
    countAllInstruments: async (_, __, { dataSources }) => await dataSources.instrumentAPI.countAllInstruments(),
    // eslint-disable-next-line max-len
    getAllInstruments: (_, { limit, offset }, { dataSources }) => dataSources.instrumentAPI.getAllInstruments({ limit, offset }),
    // eslint-disable-next-line max-len
    getAllInstrumentsWithInfo: async (_, { limit, offset }, { dataSources }) => dataSources.instrumentAPI.getAllInstrumentsWithInfo({ limit, offset }),
    getAllInstrumentsWithModel: async (
      _,
      {
        modelNumber, vendor, limit, offset,
      },
      { dataSources },
    ) => await dataSources.instrumentAPI.getAllInstrumentsWithModel({
      modelNumber,
      vendor,
      limit,
      offset,
    }),
    getAllInstrumentsWithModelNum: async (
      _,
      { modelNumber },
      { dataSources },
    ) => await dataSources.instrumentAPI.getAllInstrumentsWithModelNum({
      modelNumber,
    }),
    // eslint-disable-next-line max-len
    getAllInstrumentsWithVendor: async (_, { vendor }, { dataSources }) => await dataSources.instrumentAPI.getAllInstrumentsWithVendor({ vendor }),
    getInstrument: async (
      _,
      { modelNumber, vendor, serialNumber },
      { dataSources },
    ) => await dataSources.instrumentAPI.getInstrument({
      modelNumber,
      vendor,
      serialNumber,
    }),
    getInstrumentsWithFilter: async (
      _,
      {
        // eslint-disable-next-line max-len
        vendor, modelNumber, description, serialNumber, assetTag, modelCategories, instrumentCategories, limit, offset,
      },
      { dataSources },
    ) => await dataSources.instrumentAPI.getInstrumentsWithFilter({
      vendor,
      modelNumber,
      description,
      serialNumber,
      assetTag,
      modelCategories,
      instrumentCategories,
      limit,
      offset,
    }),

    // Calibration Queries
    // eslint-disable-next-line max-len
    getAllCalibrationEvents: (_, { limit, offset }, { dataSources }) => dataSources.calibrationEventAPI.getAllCalibrationEvents({
      limit,
      offset,
    }),
    getCalibrationEventsByInstrument: async (
      _,
      { modelNumber, vendor, serialNumber },
      { dataSources },
    ) => await dataSources.calibrationEventAPI.getCalibrationEventsByInstrument({
      modelNumber,
      vendor,
      serialNumber,
    }),
    getCalibrationEventsByReferenceId: async (
      _,
      { calibrationHistoryIdReference },
      { dataSources },
    ) => await dataSources.calibrationEventAPI.getCalibrationEventsByReferenceId({
      calibrationHistoryIdReference,
    }),
  },
  Mutation: {
    bulkImportData: async (
      _,
      {
        models, instruments, // calibrationEvents,
      },
      { dataSources },
    ) => await dataSources.bulkDataAPI.bulkImportData({
      models,
      instruments,
      // calibrationEvents,
    }),
    // eslint-disable-next-line max-len
    deleteModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.deleteModel({ modelNumber, vendor }),
    editModel: async (
      _,
      {
        id, modelNumber, vendor, description, comment, calibrationFrequency,
      },
      { dataSources },
    ) => await dataSources.modelAPI.editModel({
      id,
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
    }),
    addModel: async (
      _,
      {
        modelNumber, vendor, description, comment, calibrationFrequency,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.addModel({
        modelNumber,
        vendor,
        description,
        comment,
        calibrationFrequency,
      });
      return response;
    },
    // eslint-disable-next-line max-len
    deleteInstrument: async (_, { id }, { dataSources }) => await dataSources.instrumentAPI.deleteInstrument({ id }),
    editInstrument: async (
      _,
      {
        modelNumber, vendor, serialNumber, comment, id,
      },
      { dataSources },
    ) => await dataSources.instrumentAPI.editInstrument({
      modelNumber,
      vendor,
      serialNumber,
      comment,
      id,
    }),
    addInstrument: async (
      _,
      {
        modelNumber, vendor, serialNumber, comment,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.addInstrument({
        modelNumber,
        vendor,
        serialNumber,
        comment,
      });
      return response;
    },
    addCalibrationEvent: async (
      _,
      {
        modelNumber, vendor, serialNumber, user, date, comment,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addCalibrationEvent(
        {
          modelNumber,
          vendor,
          serialNumber,
          user,
          date,
          comment,
        },
      );
      return response;
    },
    addCalibrationEventById: async (
      _,
      {
        calibrationHistoryIdReference, user, date, comment,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addCalibrationEventById(
        {
          calibrationHistoryIdReference,
          user,
          date,
          comment,
        },
      );
      return response;
    },
    deleteCalibrationEvent: async (_, { id }, { dataSources }) => {
      const response = await dataSources.calibrationEventAPI.deleteCalibrationEvent(
        { id },
      );
      return response;
    },
    editCalibrationEvent: async (
      _,
      {
        user, date, comment, id,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.editCalibrationEvent(
        {
          user,
          date,
          comment,
          id,
        },
      );
      return response;
    },
    login: async (_, { userName, password }, { dataSources }) => {
      const response = await dataSources.userAPI.login({
        userName,
        password,
      });
      return response;
    },
    oauthLogin: async (_, { netId, firstName, lastName }, { dataSources }) => {
      const response = await dataSources.userAPI.oauthLogin({
        netId,
        firstName,
        lastName,
      });
      return response;
    },
    changePassword: async (_, { userName, oldPassword, newPassword }, { dataSources }) => {
      const response = await dataSources.userAPI.updatePassword({
        userName,
        oldPassword,
        newPassword,
      });
      return response;
    },
    signup: async (
      _,
      {
        lastName, email, password, firstName, userName, isAdmin,
      },
      { dataSources },
    ) => {
      // gen salt and hash user's password, then pass to api so it can be put in DB
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      const response = await dataSources.userAPI.createUser({
        email,
        firstName,
        lastName,
        userName,
        password: hash,
        isAdmin,
      });
      return response;
    },
    editPermissions: async (_, { userName, isAdmin }, { dataSources }) => await dataSources.userAPI.editPermissions({ userName, isAdmin }),
    deleteUser: async (_, { userName }, { dataSources }) => await dataSources.userAPI.deleteUser({ userName }),
    addModelCategory: async (
      _,
      {
        name,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.addModelCategory({
        name,
      });
      return response;
    },
    removeModelCategory: async (
      _,
      {
        name,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.removeModelCategory({
        name,
      });
      return response;
    },
    editModelCategory: async (
      _,
      {
        currentName, updatedName,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.editModelCategory({
        currentName, updatedName,
      });
      return response;
    },
    addInstrumentCategory: async (
      _,
      {
        name,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.addInstrumentCategory({
        name,
      });
      return response;
    },
    removeInstrumentCategory: async (
      _,
      {
        name,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.removeInstrumentCategory({
        name,
      });
      return response;
    },
    editInstrumentCategory: async (
      _,
      {
        currentName, updatedName,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.editInstrumentCategory({
        currentName, updatedName,
      });
      return response;
    },
    addCategoryToModel: async (
      _,
      {
        vendor, modelNumber, category,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.addCategoryToModel({
        vendor, modelNumber, category,
      });
      return response;
    },
    removeCategoryFromModel: async (
      _,
      {
        vendor, modelNumber, category,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.removeCategoryFromModel({
        vendor, modelNumber, category,
      });
      return response;
    },
    addCategoryToInstrument: async (
      _,
      {
        vendor, modelNumber, serialNumber, category,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.addCategoryToInstrument({
        vendor, modelNumber, serialNumber, category,
      });
      return response;
    },
    removeCategoryFromInstrument: async (
      _,
      {
        vendor, modelNumber, serialNumber, category,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.removeCategoryFromInstrument({
        vendor, modelNumber, serialNumber, category,
      });
      return response;
    },
  },
};
