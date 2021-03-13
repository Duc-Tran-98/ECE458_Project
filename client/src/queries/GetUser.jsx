import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default function GetUser({ userName, includeAll = false }) {
  GetUser.propTypes = {
    userName: PropTypes.string.isRequired,
    includePermissions: PropTypes.bool,
  };
  const GET_USER = gql`
    query GetUser($userName: String!) {
      getUser(userName: $userName) {
        firstName
        lastName
      }
    }
  `;
  const GET_USER_ALL = gql`
    query GetUserQuery($userName: String!) {
      getUser(userName: $userName) {
        firstName
        lastName
        email
        isAdmin
        userName
        modelPermission
        calibrationPermission
        instrumentPermission
      }
    }
  `;

  const query = print(includeAll ? GET_USER_ALL : GET_USER);
  const queryName = 'getUser';
  const getVariables = () => ({ userName });
  const response = QueryAndThen({ query, queryName, getVariables });
  return response;
}

export function GetAllUsers({ limit, offset }) {
  GetAllUsers.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
  };
  GetAllUsers.defaultProps = {
    limit: null,
    offset: null,
  };
  const GET_USERS = gql`
    query GetUsers($limit: Int, $offset: Int) {
      getAllUsers(limit: $limit, offset: $offset) {
        firstName
        lastName
        userName
        isAdmin
        id
        modelPermission
        calibrationPermission
        instrumentPermission
      }
    }
  `;

  const query = print(GET_USERS);
  const queryName = 'getAllUsers';
  const getVariables = () => ({ limit, offset });
  const response = QueryAndThen({ query, queryName, getVariables });
  return response;
}

export function CountAllUsers() {
  const query = print(gql`
    query GetUsers {
      countAllUsers
    }
  `);
  const queryName = 'countAllUsers';
  const response = QueryAndThen({ query, queryName });
  return response;
}
