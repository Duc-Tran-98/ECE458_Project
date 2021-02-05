import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from './UseQuery';

const UserContext = React.createContext({});

export const UserProvider = ({ children }) => {
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [user, setUserState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  useEffect(() => {
    if (window.sessionStorage.getItem('token')) {
      // If user logged in
      const queryName = 'getUser';
      const GET_USER_QUERY = gql`
        query GetUserQuery($userName: String!) {
          getUser(userName: $userName){
            firstName
            lastName
            email
            isAdmin
            userName
          }
        }
      `;
      const getVariables = () => ({
        userName: Buffer.from(
          window.sessionStorage.getItem('token'),
          'base64',
        ).toString('ascii'),
      });
      const query = print(GET_USER_QUERY);
      const handleResponse = (response) => {
        response.isLoggedIn = true;
        // console.log(response);
        setUserState(response);
      };
      Query({
        query,
        queryName,
        getVariables,
        handleResponse, // This will get user information
      });
      window.sessionStorage.clear();
    }
  });
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export default UserContext;
