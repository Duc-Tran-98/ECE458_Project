const { gql } = require('apollo-server');

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    # User Related Queries
    isAdmin(userName: String!): Boolean!
    getUser(userName: String!): User!
    getAllUsers(limit: Int, offset: Int): [User]
    countAllUsers: Int!

    # Model Related Queries
    countAllModels: Int!
    getAllModels(limit: Int, offset: Int): [Model]
    getAllModelsWithModelNum(modelNumber: String!): [Model]
    getAllModelsWithVendor(vendor: String!): [Model]
    getModel(modelNumber: String!, vendor: String!): Model
    getUniqueVendors: [Model]
    getModelsWithFilter(vendor: String, modelNumber: String, description: String, categories: [String], limit: Int, offset: Int): [ModelOutput]
    countModelsWithFilter(vendor: String, modelNumber: String, description: String, categories: [String]): Int

    # Instrument Related Queries
    countAllInstruments: Int!
    getAllInstruments(limit: Int, offset: Int): [Instrument]
    getAllInstrumentsWithInfo(limit: Int, offset: Int): [InstrumentWithCalibration]
    getAllInstrumentsWithModel(
      modelNumber: String!
      vendor: String!
      limit: Int
      offset: Int
    ): InstrumentScrollFeed
    getAllInstrumentsWithModelNum(modelNumber: String!): [Instrument]
    getAllInstrumentsWithVendor(vendor: String!): [Instrument]
    getInstrument(
      modelNumber: String!
      vendor: String!
      serialNumber: String!
    ): Instrument
    getInstrumentsWithFilter(
      vendor: String, 
      modelNumber: String, 
      description: String,
      serialNumber: String,
      assetTag: Int, 
      modelCategories: [String], 
      instrumentCategories: [String], 
      limit: Int, 
      offset: Int
      ): [InstrumentOutput]
      countInstrumentsWithFilter(
      vendor: String, 
      modelNumber: String, 
      description: String,
      serialNumber: String,
      assetTag: Int, 
      modelCategories: [String], 
      instrumentCategories: [String], 
      limit: Int, 
      offset: Int
      ): Int

    # Calibration Event Related Queries
    getAllCalibrationEvents(limit: Int, offset: Int): [CalibrationEvent]
    getCalibrationEventsByInstrument(
      modelNumber: String!
      vendor: String!
      serialNumber: String!
    ): [CalibrationEvent]
    getCalibrationEventsByReferenceId(
      calibrationHistoryIdReference: Int!
    ): [CalibrationEvent]

    # category related queries
    getAllModelCategories(limit: Int, offset: Int): [Category]
    getAllInstrumentCategories(limit: Int, offset: Int): [Category]
    countModelCategories: Int!
    countInstrumentCategories: Int!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    userName: String!
    password: String!
    isAdmin: Boolean!
  }

  type InstrumentScrollFeed {
    rows: [Instrument]
    total: Int!
  }

  type Model {
    id: ID!
    vendor: String!
    modelNumber: String!
    description: String!
    comment: String
    calibrationFrequency: Int
  }

  type ModelOutput {
    id: ID!
    vendor: String!
    modelNumber: String!
    description: String!
    comment: String
    calibrationFrequency: Int
    categories: [Category]
  }

  type Category {
    id: Int!
    name: String!
  }

  type Instrument {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    description: String!
    id: Int!
  }

  type InstrumentOutput {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    description: String!
    id: Int!
    recentCalibration: [Calibration]
    modelCategories: [Category]
    instrumentCategories: [Category]
  }

  type Calibration {
    user: String!
    date: String!
    comment: String
  }

  type InstrumentWithCalibration {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    description: String!
    id: Int!
    recentCalDate: String
    recentCalUser: String
    recentCalComment: String
  }

  type CalibrationEvent {
    id: ID!
    calibrationHistoryIdReference: Int!
    user: String!
    date: String!
    comment: String
  }

  input ModelInput {
    vendor: String!
    modelNumber: String!
    description: String!
    comment: String
    calibrationFrequency: Int
  }

  input InstrumentInput {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    comment: String
    calibrationUser: String
    calibrationDate: String
    calibrationComment: String
  }

  input CalibrationEventInput {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    user: String!
    date: String!
    comment: String
  }

  # Mutation type allows clients to change state
  type Mutation {
    # User related mutations
    login(userName: String!, password: String!): String!
    oauthLogin(netId: String!, firstName: String!, lastName: String!): String!
    changePassword(userName: String!, oldPassword: String!, newPassword: String!): String!
    signup(
      email: String!
      firstName: String!
      lastName: String!
      userName: String!
      password: String!
      isAdmin: Boolean!
    ): String!
    editPermissions(userName: String!, isAdmin: Boolean!): String!
    deleteUser(userName: String!): String!

    # Model related Mutations
    addModel(
      modelNumber: String!
      vendor: String!
      description: String!
      comment: String
      calibrationFrequency: Int
    ): String!
    deleteModel(modelNumber: String!, vendor: String!): String!
    editModel(
      id: Int!
      modelNumber: String!
      vendor: String!
      description: String!
      comment: String
      calibrationFrequency: Int
    ): String!

    # Instrument related mutations
    addInstrument(
      modelNumber: String!
      vendor: String!
      serialNumber: String
      comment: String
    ): String!
    editInstrument(
      modelNumber: String!
      vendor: String!
      comment: String
      serialNumber: String!
      id: Int!
    ): String!
    deleteInstrument(id: Int!): String!

    # Calibration Events related mutations
    addCalibrationEvent(modelNumber: String!, vendor: String!, serialNumber: String!, date: String!, user: String! comment: String): String!

    #bulk import
    # bulkImportData(models: [ModelInput], instruments: [InstrumentInput], calibrationEvents: [CalibrationEventInput]): String!
    bulkImportData(models: [ModelInput], instruments: [InstrumentInput]): String!
    addCalibrationEventById(calibrationHistoryIdReference: Int!, date: String!, user: String! comment: String): String!
    deleteCalibrationEvent(id: Int!): String!
    editCalibrationEvent(
      user: String
      date: String
      comment: String
      id: Int!
    ): String!

    # category related mutations
    addModelCategory(name: String!): String!
    removeModelCategory(name: String!): String!
    editModelCategory(currentName: String!, updatedName: String!): String!

    addInstrumentCategory(name: String!): String!
    removeInstrumentCategory(name: String!): String!
    editInstrumentCategory(currentName: String!, updatedName: String!): String!

    addCategoryToModel(vendor: String!, modelNumber: String!, category: String!): String!
    removeCategoryFromModel(vendor: String!, modelNumber: String!, category: String!): String!

    addCategoryToInstrument(vendor: String!, modelNumber: String!, serialNumber: String!, category: String!): String!
    removeCategoryFromInstrument(vendor: String!, modelNumber: String!, serialNumber: String!, category: String!): String!

  }
`;

module.exports = typeDefs;
