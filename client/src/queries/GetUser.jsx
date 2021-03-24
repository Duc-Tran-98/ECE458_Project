import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default function GetUser({ userName, includeAll = false, fetchPolicy = null }) {
  GetUser.propTypes = {
    userName: PropTypes.string.isRequired,
    includeAll: PropTypes.bool,
    fetchPolicy: PropTypes.string,
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

  const query = includeAll ? GET_USER_ALL : GET_USER;
  const queryName = 'getUser';
  const getVariables = () => ({ userName });
  const response = QueryAndThen({
    query, queryName, getVariables, fetchPolicy,
  });
  return response;
}

export function GetAllUsers({ limit, offset, orderBy }) {
  GetAllUsers.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    orderBy: PropTypes.array,
  };
  GetAllUsers.defaultProps = {
    limit: null,
    offset: null,
  };
  const GET_USERS = gql`
    query GetUsers(
      $limit: Int
      $offset: Int
      $orderBy: [[String]]
    ) {
      getAllUsers(
        limit: $limit
        offset: $offset
        orderBy: $orderBy
      ) { 
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

  const query = GET_USERS;
  const queryName = 'getAllUsers';
  const getVariables = () => ({ limit, offset, orderBy });
  const response = QueryAndThen({ query, queryName, getVariables });
  return response;
}

export function CountAllUsers() {
  const query = gql`
    query GetUsers {
      countAllUsers
    }
  `;
  const queryName = 'countAllUsers';
  const response = QueryAndThen({ query, queryName });
  return response;
}
