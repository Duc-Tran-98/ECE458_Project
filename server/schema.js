// This file deals with the database schema
const { gql } = require("apollo-server");

const typeDefs = gql`
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    me: User
    isAdmin(userName: String!): Boolean!
  }
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    userName: String!
    password: String!
    token: String
    isAdmin: Boolean!
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
  }
`;

module.exports = typeDefs;
