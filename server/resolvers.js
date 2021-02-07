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
    // Model Queries
    getAllModels: (_, __, { dataSources }) => dataSources.modelAPI.getAllModels(),
    getAllModelsWithModelNum: async (_, { modelNumber }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithModelNum({ modelNumber }),
    getAllModelsWithVendor: async (_, { vendor }, { dataSources }) => await dataSources.modelAPI.getAllModelsWithVendor({ vendor }),
    // eslint-disable-next-line max-len
    getModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.getModel({ modelNumber, vendor }),
    // Instrument Queries
    getAllInstruments: (_, __, { dataSources }) => dataSources.instrumentAPI.getAllInstruments(),
    // eslint-disable-next-line max-len
    getInstrument: async (_, { modelNumber, vendor, serialNumber }, { dataSources }) => await dataSources.instrumentAPI.getInstrument({ modelNumber, vendor, serialNumber }),
    // Calibration Queries
    // eslint-disable-next-line max-len
    getAllCalibrationEvents: (_, __, { dataSources }) => dataSources.calibrationEventAPI.getAllCalibrationEvents(),
    getCalibrationEventsByInstrument: async (
      _,
      { modelNumber, vendor, serialNumber },
      { dataSources },
    // eslint-disable-next-line max-len
    ) => dataSources.calibrationEventAPI.getCalibrationEventsByInstrument({ modelNumber, vendor, serialNumber }),
  },
  Mutation: {
    // eslint-disable-next-line max-len
    deleteModel: async (_, { modelNumber, vendor }, { dataSources }) => await dataSources.modelAPI.deleteModel({ modelNumber, vendor }),
    editModel: async (
      _,
      {
        modelNumber, vendor, description, comment, calibrationFrequency, id,
      },
      { dataSources },
    ) => await dataSources.modelAPI.editModel({
      modelNumber,
      vendor,
      description,
      comment,
      calibrationFrequency,
      id,
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
    login: async (_, { userName, password }, { dataSources }) => {
      const response = await dataSources.userAPI.login({
        userName,
        password,
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
  },
};
