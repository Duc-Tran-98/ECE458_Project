/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';

const UserContext = React.createContext({});

export const UserProvider = ({ children, loggedIn }) => {
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  };
  const [user, setUserState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    modelPermission: false,
    calibrationPermission: false,
    instrumentPermission: false,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  let token = window.sessionStorage.getItem('token');

  useEffect(() => {
    token = window.sessionStorage.getItem('token');
    if (token === null) {
      setUserState({
        isLoggedIn: false,
        isAdmin: false,
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        modelPermission: false,
        calibrationPermission: false,
        instrumentPermission: false,
      });
    } else {
      // If user logged in
      const queryName = 'getUser';
      const GET_USER_QUERY = gql`
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
      const getVariables = () => ({
        userName: Buffer.from(
          token,
          'base64',
        ).toString('ascii'),
      });
      const query = print(GET_USER_QUERY);
      const handleResponse = (response) => {
        response.isLoggedIn = true;
        setUserState(response);
      };
      Query({
        query,
        queryName,
        getVariables,
        handleResponse, // This will get user information
      });
    }
  }, [loggedIn]);
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export default UserContext;
