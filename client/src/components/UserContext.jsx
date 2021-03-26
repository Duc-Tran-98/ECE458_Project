import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import GetUser from '../queries/GetUser';

const UserContext = React.createContext({});

let intervalId = 0;
const pollingPeriod = 3 * 1000; // 3s * 1000 ms/s

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
  const startPolling = (initVal) => {
    intervalId = setInterval(() => {
      // add polling to check if user exists or not
      token = window.sessionStorage.getItem('token');
      if (token) { // If there's token (user needs to have signed in first)
        GetUser({ // poll user info
          userName: Buffer.from(token, 'base64').toString('ascii'),
          includeAll: true,
          fetchPolicy: 'no-cache',
        }).then((res) => {
          if (typeof res === 'undefined') {
            // undefined => user got deleted
            toast.error('This account has been deleted! Signing you out.');
            clearInterval(intervalId);
            handleSignOut(); // stop polling, and sign out user
          } else {
            // res !== undefined => user still exsits, so let's check if
            // their permissions change
            const hasChanged = JSON.stringify(res) !== JSON.stringify(initVal);
            // console.log(hasChanged);
            if (hasChanged) {
              // initVal and newly polled val don't match
              setUserState(res); // update state
              clearInterval(intervalId); // stop old polling
              startPolling(res); // start new poll with new init val
              toast('User permission have changed.');
            }
          }
        });
      }
    }, pollingPeriod); // every 3s, check if user still exists
  };

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
      clearInterval(intervalId); // stop previous polling!
    } else {
      // else user logged in
      setTimeout(() => {
        GetUser({
          userName: Buffer.from(token, 'base64').toString('ascii'),
          includeAll: true,
          fetchPolicy: 'no-cache',
        }).then((val) => {
          setUserState(val);
          startPolling(val);
        });
      }, 500); // set timeout to give time for new authheader to get applied
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [loggedIn]);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export const UserConsumer = UserContext.Consumer;
export default UserContext;
