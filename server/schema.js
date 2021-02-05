const { gql } = require('apollo-server');

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  type Query {
    isAdmin(userName: String!): Boolean!
    getUser(userName: String!): String!
    getAllModels: [Model]
    getAllInstruments: [Instrument]
    getAllCalibrationEvents: [CalibrationEvent]
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
    isCalibratable: Boolean!
    comment: String
    calibrationHistoryId: Int!
  }
  type CalibrationEvent {
    id: ID!
    calibrationHistoryIdReference: Int!
    user: String!
    date: String!
    comment: String
  }
  # Mutation type allows clients to change state
  type Mutation {
    login(userName: String!, password: String!): String!
    signup(
      email: String!
      firstName: String!
      lastName: String!
      userName: String!
      password: String!
      isAdmin: Boolean!
    ): String!
    addModel(modelNumber: String!, vendor: String!, description: String!, comment: String, calibrationFrequency: Int): String!
  }
`;

module.exports = typeDefs;
