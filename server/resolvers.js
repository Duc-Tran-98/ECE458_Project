/* eslint-disable max-len */
// Resolvers define the technique for fetching the types defined in the
// schema.
const bcrypt = require('bcryptjs');
const { PubSub } = require('apollo-server');
const { withFilter } = require('apollo-server');

const pubsub = new PubSub();
const triggerWord = 'USER_MODIFIED';
// For hashing password
const saltRounds = 10;
module.exports = {
  Query: {
    // User Queries
    getUser: async (_, { userName }, { dataSources }) => await dataSources.userAPI.findUser({ userName }),
    isAdmin: (_, { userName }, { dataSources }) => dataSources.userAPI.isAdmin({ userName }),
    getAllUsers: async (_, { limit, offset, orderBy }, { dataSources }) => await dataSources.userAPI.getAllUsers({ limit, offset, orderBy }),
    countAllUsers: async (_, __, { dataSources }) => await dataSources.userAPI.countAllUsers(),

    countModelCategories: async (_, __, { dataSources }) => await dataSources.modelAPI.countModelCategories(),
    countInstrumentCategories: async (_, __, { dataSources }) => await dataSources.instrumentAPI.countInstrumentCategories(),
    countModelsAttachedToCategory: (_, { name }, { dataSources }) => dataSources.modelAPI.countModelsAttachedToCategory({ name }),
    countInstrumentsAttachedToCategory: (_, { name }, { dataSources }) => dataSources.instrumentAPI.countInstrumentsAttachedToCategory({ name }),

    // Model Queries
    countAllModels: async (_, __, { dataSources }) => await dataSources.modelAPI.countAllModels(),
    getAllModels: (_, { limit, offset }, { dataSources }) => dataSources.modelAPI.getAllModels({ limit, offset }),
    getAllModelsWithModelNum: async (_, { modelNumber }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithModelNum({ modelNumber }),
    getAllModelsWithVendor: async (_, { vendor }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithVendor({ vendor }),
    getModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.getModel({ modelNumber, vendor }),
    getModelById: async (_, { id }, { dataSources }) => await dataSources.modelAPI.getModelById({ id }),
    getModelsWithFilter: async (
      _,
      {
        vendor, modelNumber, description, categories, limit, offset, orderBy,
      },
      { dataSources },
    ) => await dataSources.modelAPI.getModelsWithFilter({
      vendor,
      modelNumber,
      description,
      categories,
      limit,
      offset,
      orderBy,
    }),

    getUniqueVendors: async (_, __, { dataSources }) => await dataSources.modelAPI.getUniqueVendors(),

    // Instrument Queries
    countAllInstruments: async (_, __, { dataSources }) => await dataSources.instrumentAPI.countAllInstruments(),
    getAllInstruments: (_, { limit, offset }, { dataSources }) => dataSources.instrumentAPI.getAllInstruments({ limit, offset }),
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
    getInstrumentByAssetTag: async (_, { assetTag }, { dataSources }) => await dataSources.instrumentAPI.getInstrumentByAssetTag({
      assetTag,
    }),
    getInstrumentById: async (_, { id }, { dataSources }) => await dataSources.instrumentAPI.getInstrumentById({ id }),
    getInstrumentsWithFilter: async (
      _,
      {
        vendor,
        modelNumber,
        description,
        serialNumber,
        assetTag,
        modelCategories,
        instrumentCategories,
        limit,
        offset,
        orderBy,
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
      orderBy,
    }),

    // Calibration Queries
    getAllCalibrationEvents: (_, { limit, offset }, { dataSources }) => dataSources.calibrationEventAPI.getAllCalibrationEvents({
      limit,
      offset,
    }),
    getCalibrationEventsByInstrument: async (
      _,
      { modelNumber, vendor, assetTag },
      { dataSources },
    ) => await dataSources.calibrationEventAPI.getCalibrationEventsByInstrument({
      modelNumber,
      vendor,
      assetTag,
    }),
    getCalibrationEventsByReferenceId: async (
      _,
      { calibrationHistoryIdReference },
      { dataSources },
    ) => await dataSources.calibrationEventAPI.getCalibrationEventsByReferenceId({
      calibrationHistoryIdReference,
    }),
    getAllModelCategories: async (
      _,
      { limit, offset, orderBy },
      { dataSources },
    ) => await dataSources.modelAPI.getAllModelCategories({
      limit,
      offset,
      orderBy,
    }),
    getAllInstrumentCategories: async (
      _,
      { limit, offset, orderBy },
      { dataSources },
    ) => await dataSources.instrumentAPI.getAllInstrumentCategories({
      limit,
      offset,
      orderBy,
    }),
  },
  Mutation: {
    bulkImportData: async (
      _,
      {
        models,
        instruments, // calibrationEvents,
      },
      { dataSources },
    ) => await dataSources.bulkDataAPI.bulkImportData({
      models,
      instruments,
      // calibrationEvents,
    }),
    bulkImportModels: async (_, { models }, { dataSources }) => await dataSources.bulkDataAPI.bulkImportModels({
      models,
    }),
    bulkImportInstruments: async (_, { instruments }, { dataSources }) => await dataSources.bulkDataAPI.bulkImportInstruments({
      instruments,
    }),
    deleteModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.deleteModel({ modelNumber, vendor }),
    editModel: async (
      _,
      {
        id,
        modelNumber,
        vendor,
        description,
        comment,
        calibrationFrequency,
        supportLoadBankCalibration,
        supportKlufeCalibration,
        categories,
        calibratorCategories,
        requiresCalibrationApproval,
        supportCustomCalibration,
        customForm,
      },
      { dataSources },
    ) => await dataSources.modelAPI.editModel({
      id,
      modelNumber,
      vendor,
      description,
      comment,
      supportLoadBankCalibration,
      supportKlufeCalibration,
      calibrationFrequency,
      categories,
      calibratorCategories,
      requiresCalibrationApproval,
      supportCustomCalibration,
      customForm,
    }),
    addModel: async (
      _,
      {
        modelNumber,
        vendor,
        description,
        comment,
        calibrationFrequency,
        supportLoadBankCalibration,
        supportKlufeCalibration,
        categories,
        calibratorCategories,
        requiresCalibrationApproval,
        supportCustomCalibration,
        customForm,
      },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.addModel({
        modelNumber,
        vendor,
        description,
        comment,
        calibrationFrequency,
        supportLoadBankCalibration,
        supportKlufeCalibration,
        categories,
        calibratorCategories,
        requiresCalibrationApproval,
        supportCustomCalibration,
        customForm,
      });
      return response;
    },
    // eslint-disable-next-line max-len
    deleteInstrument: async (_, { id }, { dataSources }) => await dataSources.instrumentAPI.deleteInstrument({ id }),
    editInstrument: async (
      _,
      {
        modelNumber, vendor, serialNumber, comment, assetTag, id, categories,
      },
      { dataSources },
    ) => await dataSources.instrumentAPI.editInstrument({
      modelNumber,
      vendor,
      serialNumber,
      comment,
      assetTag,
      id,
      categories,
    }),
    addInstrument: async (
      _,
      {
        modelNumber, vendor, assetTag, serialNumber, comment, categories,
      },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.addInstrument({
        modelNumber,
        vendor,
        assetTag,
        serialNumber,
        comment,
        categories,
      });
      return response;
    },
    addCalibrationEvent: async (
      _,
      {
        modelNumber,
        vendor,
        serialNumber,
        user,
        date,
        comment,
        fileLocation,
        fileName,
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
          fileLocation,
          fileName,
        },
      );
      return response;
    },
    addCalibrationEventByAssetTag: async (
      _,
      {
        assetTag, user, date, comment, fileLocation, fileName,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addCalibrationEventByAssetTag(
        {
          assetTag,
          user,
          date,
          comment,
          fileLocation,
          fileName,
        },
      );
      return response;
    },
    addLoadBankCalibration: async (
      _,
      {
        assetTag, user, date, comment, loadBankData,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addLoadBankCalibration(
        {
          assetTag,
          user,
          date,
          comment,
          loadBankData,
        },
      );
      return response;
    },
    addKlufeCalibration: async (
      _,
      {
        assetTag, user, date, comment, klufeData,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addKlufeCalibration(
        {
          assetTag,
          user,
          date,
          comment,
          klufeData,
        },
      );
      return response;
    },
    addCustomFormCalibration: async (
      _,
      {
        assetTag, user, date, comment, customFormData,
      },
      { dataSources },
    ) => {
      const response = await dataSources.calibrationEventAPI.addCustomFormCalibration(
        {
          assetTag,
          user,
          date,
          comment,
          customFormData,
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
    changePassword: async (
      _,
      { userName, oldPassword, newPassword },
      { dataSources },
    ) => {
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
        lastName,
        email,
        password,
        firstName,
        userName,
        isAdmin,
        instrumentPermission,
        modelPermission,
        calibrationPermission,
        calibrationApproverPermission,
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
        instrumentPermission,
        modelPermission,
        calibrationPermission,
        calibrationApproverPermission,
      });
      return response;
    },
    editPermissions: async (
      _,
      {
        userName,
        isAdmin,
        modelPermission,
        calibrationPermission,
        instrumentPermission,
        calibrationApproverPermission,
      },
      { dataSources },
    ) => {
      const response = await dataSources.userAPI.editPermissions({
        userName,
        isAdmin,
        modelPermission,
        calibrationPermission,
        instrumentPermission,
        calibrationApproverPermission,
      });
      if (response.user) {
        pubsub.publish(triggerWord, {
          userChanged: response.user,
        });
      }
      return response;
    },
    deleteUser: async (_, { userName }, { dataSources }) => await dataSources.userAPI.deleteUser({ userName }),
    addModelCategory: async (_, { name }, { dataSources }) => {
      const response = await dataSources.modelAPI.addModelCategory({
        name,
      });
      return response;
    },
    removeModelCategory: async (_, { name }, { dataSources }) => {
      const response = await dataSources.modelAPI.removeModelCategory({
        name,
      });
      return response;
    },
    editModelCategory: async (
      _,
      { currentName, updatedName },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.editModelCategory({
        currentName,
        updatedName,
      });
      return response;
    },
    addInstrumentCategory: async (_, { name }, { dataSources }) => {
      const response = await dataSources.instrumentAPI.addInstrumentCategory({
        name,
      });
      return response;
    },
    removeInstrumentCategory: async (_, { name }, { dataSources }) => {
      const response = await dataSources.instrumentAPI.removeInstrumentCategory(
        {
          name,
        },
      );
      return response;
    },
    editInstrumentCategory: async (
      _,
      { currentName, updatedName },
      { dataSources },
    ) => {
      const response = await dataSources.instrumentAPI.editInstrumentCategory({
        currentName,
        updatedName,
      });
      return response;
    },
    addCategoryToModel: async (
      _,
      { vendor, modelNumber, category },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.addCategoryToModel({
        vendor,
        modelNumber,
        category,
      });
      return response;
    },
    removeCategoryFromModel: async (
      _,
      { vendor, modelNumber, category },
      { dataSources },
    ) => {
      const response = await dataSources.modelAPI.removeCategoryFromModel({
        vendor,
        modelNumber,
        category,
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
        vendor,
        modelNumber,
        serialNumber,
        category,
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
      const response = await dataSources.instrumentAPI.removeCategoryFromInstrument(
        {
          vendor,
          modelNumber,
          serialNumber,
          category,
        },
      );
      return response;
    },
  },
  Subscription: {
    userChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(triggerWord),
        (payload, variables) => (payload.userChanged.userName === variables.userName)
        ,
      ),
    },
  },
};
