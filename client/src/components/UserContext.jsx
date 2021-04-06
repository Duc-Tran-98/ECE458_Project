import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// import { toast } from 'react-toastify';
import { gql } from '@apollo/client';
import GetUser from '../queries/GetUser';
import { Subscribe } from './UseQuery';

const UserContext = React.createContext({});
let subscription = null;
// eslint-disable-next-line no-unused-vars
export const UserProvider = ({ children, loggedIn, handleSignOut }) => {
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    handleSignOut: PropTypes.func.isRequired,
  };

  const [user, setUserState] = React.useState({
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
    if (token === null) { // user signed out
      setUserState({
        isAdmin: false,
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        modelPermission: false,
        calibrationPermission: false,
        instrumentPermission: false,
      });
      if (subscription) {
        subscription.unsubscribe();
      }
    } else {
      // else user logged in
      setTimeout(() => {
        GetUser({
          userName: Buffer.from(token, 'base64').toString('ascii'),
          includeAll: true,
          fetchPolicy: 'no-cache',
        }).then((val) => {
          setUserState(val);
          subscription = Subscribe({
            query: gql`
              subscription Test($userName: String!) {
                userChanged(userName: $userName) {
                  modelPermission
                  calibrationPermission
                  calibrationApproverPermission
                  instrumentPermission
                  isAdmin
                  firstName
                  lastName
                }
              }
            `,
            getVariables: () => ({ userName: val.userName }),
          }).subscribe({
            next: ({ data }) => {
              console.log(data.userChanged); // do something with new user data
              setUserState(data.userChanged);
            },
            error: (err) => {
              console.error('err', err);
            },
          });
        });
      }, 100); // set timeout to give time for new authheader to get applied
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [loggedIn]);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export const UserConsumer = UserContext.Consumer;
export default UserContext;
