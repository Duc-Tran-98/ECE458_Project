const { gql } = require('apollo-server');

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  type Query {
    # User Related Queries
    isAdmin(userName: String!): Boolean!
    getUser(userName: String!): User!

    # Model Related Queries
    getAllModels(limit: Int, offset: Int): [Model]
    getAllModelsWithModelNum(modelNumber: String!): [Model]
    getAllModelsWithVendor(vendor: String!): [Model]
    getModel(modelNumber: String!, vendor: String!): Model

    # Instrument Related Queries
    getAllInstruments(limit: Int, offset: Int): [Instrument]
    getAllInstrumentsWithModel(modelNumber: String!, vendor: String!): [Instrument]
    getAllInstrumentsWithModelNum(modelNumber: String!): [Instrument]
    getAllInstrumentsWithVendor(vendor: String!): [Instrument]
    getInstrument(modelNumber: String!, vendor: String!, serialNumber: String!): Instrument

    # Calibration Event Related Queries
    getAllCalibrationEvents(limit: Int, offset: Int): [CalibrationEvent]
    getCalibrationEventsByInstrument(modelNumber: String!, vendor: String!, serialNumber: String!): [CalibrationEvent]
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
    deleteModel(modelNumber: String!, vendor: String!): String!
    addModel(modelNumber: String!, vendor: String!, description: String!, comment: String, calibrationFrequency: Int): String!

    # Instrument related mutations
    addInstrument(modelNumber: String!, vendor: String!, serialNumber: String!, comment: String): String!

    # Calibration Events related mutations
    addCalibrationEvent(modelNumber: String!, vendor: String!, serialNumber: String!, date: String!, user: String! comment: String): String!
    editModel(modelNumber: String!, vendor: String!, description: String!, comment: String, calibrationFrequency: Int, id: Int!): String!

    #bulk import
    bulkImportData(models: [ModelInput], instruments: [InstrumentInput], calibrationEvents: [CalibrationEventInput]): String!
  }
`;

module.exports = typeDefs;
