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
  const startPolling = (initVal) => {
    intervalId = setInterval(() => {
      // add polling to check if user exists or not
      token = window.sessionStorage.getItem('token');
      if (token) { // If there's token (user needs to have signed in first)
        GetUser({ // poll user info
          userName: Buffer.from(token, 'base64').toString('ascii'),
          includeAll: true,
        }).then((res) => {
          if (typeof res === 'undefined') {
            // undefined => user got deleted
            toast.error('This account has been delted! Signing you out.');
            clearInterval(intervalId);
            handleSignOut(); // stop polling, and sign out user
          } else {
            // res !== undefined => user still exsits, so let's check if
            // their permissions change
            res.isLoggedIn = true;
            if (JSON.stringify(res) !== JSON.stringify(initVal)) {
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
      GetUser({
        userName: Buffer.from(token, 'base64').toString('ascii'),
        includeAll: true,
      }).then((val) => {
        // eslint-disable-next-line no-param-reassign
        val.isLoggedIn = true;
        setUserState(val);
        startPolling(val);
      });
    }
  }, [loggedIn]);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
export const UserConsumer = UserContext.Consumer;
export default UserContext;
