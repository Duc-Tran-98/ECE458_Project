const { gql } = require('apollo-server');

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    # User Related Queries
    isAdmin(userName: String!): Boolean!
    getUser(userName: String!): User!
    getAllUsers(
      limit: Int
      offset: Int
      orderBy: [[String]]
    ): [User]
    countAllUsers: Int!

    # Model Related Queries
    countAllModels: Int!
    getAllModels(limit: Int, offset: Int): [Model]
    getAllModelsWithModelNum(modelNumber: String!): [Model]
    getAllModelsWithVendor(vendor: String!): [Model]
    getModel(modelNumber: String!, vendor: String!): Model
    getModelById(id: Int!): Model
    getUniqueVendors: [Model]
    getModelsWithFilter(
      vendor: String
      modelNumber: String
      description: String
      categories: [String]
      limit: Int
      offset: Int
      orderBy: [[String]]
    ): ModelOutput

    # Instrument Related Queries
    countAllInstruments: Int!
    getAllInstruments(limit: Int, offset: Int): [Instrument]
    getAllInstrumentsWithInfo(
      limit: Int
      offset: Int
    ): [InstrumentWithCalibration]
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
    getInstrumentByAssetTag(assetTag: Int!): Instrument
    getInstrumentById(id: Int!): Instrument
    getInstrumentsWithFilter(
      vendor: String
      modelNumber: String
      description: String
      serialNumber: String
      assetTag: Int
      modelCategories: [String]
      instrumentCategories: [String]
      limit: Int
      offset: Int
      orderBy: [[String]]
    ): InstrumentOutput

    # Calibration Event Related Queries
    getAllCalibrationEvents(limit: Int, offset: Int): [CalibrationEvent]
    getCalibrationEventsByInstrument(
      modelNumber: String!
      vendor: String!
      assetTag: Int!
    ): [CalibrationEvent]
    getCalibrationEventsByReferenceId(
      calibrationHistoryIdReference: Int!
    ): [CalibrationEvent]

    # category related queries
    getAllModelCategories(limit: Int, offset: Int): [Category]
    getAllInstrumentCategories(limit: Int, offset: Int): [Category]
    countModelCategories: Int!
    countInstrumentCategories: Int!
    countModelsAttachedToCategory(name: String!): Int!
    countInstrumentsAttachedToCategory(name: String!): Int!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    userName: String!
    password: String!
    isAdmin: Boolean!
    instrumentPermission: Boolean
    modelPermission: Boolean
    calibrationPermission: Boolean
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
    categories: [Category]
    supportLoadBankCalibration: Boolean!
    supportKlufeCalibration: Boolean!
  }

  type ModelOutput {
    models: [Model]
    total: Int!
  }

  type Category {
    id: Int!
    name: String!
  }

  type Instrument {
    vendor: String!
    modelNumber: String!
    serialNumber: String
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    instrumentCategories: [Category]
    description: String!
    id: Int!
    assetTag: Int!
    supportLoadBankCalibration: Boolean
    supportKlufeCalibration: Boolean
  }

  type FilteredInstrument {
    vendor: String!
    modelNumber: String!
    assetTag: Int!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    description: String!
    id: Int!
    supportLoadBankCalibration: Boolean
    recentCalibration: [Calibration]
    modelCategories: [Category]
    instrumentCategories: [Category]
  }

  type InstrumentOutput {
    instruments: [FilteredInstrument]
    total: Int!
  }

  type Calibration {
    user: String!
    date: String!
    comment: String
    fileLocation: String
    fileName: String
    loadBankData: String
    klufeData: String
  }

  type InstrumentWithCalibration {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int
    comment: String
    description: String!
    assetTag: Int!
    id: Int!
    supportLoadBankCalibration: Boolean
    recentCalDate: String
    recentCalUser: String
    recentCalComment: String
  }

  type ModelCacheUpdate {
    model: Model
    message: String!
    success: Boolean!
  }

  type CalibrationEvent {
    id: ID!
    calibrationHistoryIdReference: Int!
    user: String!
    date: String!
    comment: String
    fileLocation: String
    fileName: String
    loadBankData: String
  }

  input ModelInput {
    vendor: String!
    modelNumber: String!
    description: String!
    comment: String
    categories: [String]
    supportLoadBankCalibration: Boolean!
    supportKlufeCalibration: Boolean!
    calibrationFrequency: Int
  }

  input InstrumentInput {
    vendor: String!
    modelNumber: String!
    serialNumber: String
    assetTag: Int
    comment: String
    calibrationUser: String
    calibrationDate: String
    calibrationComment: String
    categories: [String]
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
    changePassword(
      userName: String!
      oldPassword: String!
      newPassword: String!
    ): String!
    signup(
      email: String!
      firstName: String!
      lastName: String!
      userName: String!
      password: String!
      isAdmin: Boolean!
      instrumentPermission: Boolean
      modelPermission: Boolean
      calibrationPermission: Boolean
    ): String!
    editPermissions(
      userName: String!
      isAdmin: Boolean!
      instrumentPermission: Boolean!
      modelPermission: Boolean!
      calibrationPermission: Boolean!
    ): String!
    deleteUser(userName: String!): String!

    # Model related Mutations
    addModel(
      modelNumber: String!
      vendor: String!
      description: String!
      comment: String
      calibrationFrequency: Int
      supportLoadBankCalibration: Boolean!
      supportKlufeCalibration: Boolean!
      categories: [String]
    ): String!
    deleteModel(modelNumber: String!, vendor: String!): String!
    editModel(
      id: Int!
      modelNumber: String!
      vendor: String!
      description: String!
      comment: String
      calibrationFrequency: Int
      supportLoadBankCalibration: Boolean!
      supportKlufeCalibration: Boolean!
      categories: [String]
    ): ModelCacheUpdate

    # Instrument related mutations
    addInstrument(
      modelNumber: String!
      vendor: String!
      assetTag: Int
      serialNumber: String
      comment: String
      categories: [String]
    ): String!
    editInstrument(
      modelNumber: String!
      vendor: String!
      comment: String
      serialNumber: String
      assetTag: Int
      id: Int!
      categories: [String]
    ): String!
    deleteInstrument(id: Int!): String!

    # Calibration Events related mutations
    addCalibrationEvent(
      modelNumber: String!
      vendor: String!
      serialNumber: String!
      date: String!
      user: String!
      comment: String
      fileLocation: String
      fileName: String
    ): String!

    addCalibrationEventByAssetTag(
      assetTag: Int!
      date: String!
      user: String!
      comment: String
      fileLocation: String
      fileName: String
    ): String!

    addLoadBankCalibration(
      assetTag: Int!
      date: String!
      user: String!
      comment: String
      loadBankData: String!
    ): String!

    addKlufeCalibration(
      assetTag: Int!
      date: String!
      user: String!
      comment: String
      klufeData: String!
    ): String!

    #bulk import
    # bulkImportData(models: [ModelInput], instruments: [InstrumentInput], calibrationEvents: [CalibrationEventInput]): String!
    bulkImportData(
      models: [ModelInput]
      instruments: [InstrumentInput]
    ): String!
    bulkImportModels(models: [ModelInput]): String!
    bulkImportInstruments(instruments: [InstrumentInput]): String!
    addCalibrationEventById(
      calibrationHistoryIdReference: Int!
      date: String!
      user: String!
      comment: String
    ): String!
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

    addCategoryToModel(
      vendor: String!
      modelNumber: String!
      category: String!
    ): String!
    removeCategoryFromModel(
      vendor: String!
      modelNumber: String!
      category: String!
    ): String!

    addCategoryToInstrument(
      vendor: String!
      modelNumber: String!
      serialNumber: String!
      category: String!
    ): String!
    removeCategoryFromInstrument(
      vendor: String!
      modelNumber: String!
      serialNumber: String!
      category: String!
    ): String!
  }
`;

module.exports = typeDefs;
