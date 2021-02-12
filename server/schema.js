const { gql } = require('apollo-server');

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
    # User Related Queries
    isAdmin(userName: String!): Boolean!
    getUser(userName: String!): User!
    getAllUsers: [User]

    # Model Related Queries
    getAllModels(limit: Int, offset: Int): [Model]
    getAllModelsWithModelNum(modelNumber: String!): [Model]
    getAllModelsWithVendor(vendor: String!): [Model]
    getModel(modelNumber: String!, vendor: String!): Model

    # Instrument Related Queries
    countAllInstruments: Int!
    getAllInstruments(limit: Int, offset: Int): [Instrument]
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

  type Instrument {
    vendor: String!
    modelNumber: String!
    serialNumber: String!
    modelReference: Int!
    calibrationFrequency: Int!
    comment: String
    description: String!
    id: Int!
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
    signup(
      email: String!
      firstName: String!
      lastName: String!
      userName: String!
      password: String!
      isAdmin: Boolean!
    ): String!

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
      serialNumber: String!
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
  }
`;

module.exports = typeDefs;
