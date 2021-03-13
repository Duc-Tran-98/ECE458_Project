import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default function GetUser({ userName }) {
  GetUser.propTypes = {
    userName: PropTypes.string.isRequired,
  };
  const GET_USER = gql`
    query GetUser($userName: String!) {
      getUser(userName: $userName) {
        firstName
        lastName
      }
    }
  `;

  const query = print(GET_USER);
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
