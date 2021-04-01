/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import OAuthSignOn from '../queries/OAuthSignOn';
import ExpressQuery from '../queries/ExpressQuery';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4001'
  : '/express';

export default function OAuthConsume({ handleLogin }) {
  OAuthConsume.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  const [netID, setNetID] = useState('');

  function parseIdToken(token) {
    const idToken = jwt_decode(token);
    return idToken;
  }

  const getURLCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code;
  };

  const handleOAuthSignOn = (response) => {
    window.sessionStorage.setItem(
      'token',
      Buffer.from(response.userName, 'ascii').toString('base64'),
    );
    handleLogin(response.jwt);
    window.location.href = '/';
  };

  const handleUserInfoResponse = (response) => {
    const {
      dukeNetID, given_name, family_name,
    } = response.data.result;

    OAuthSignOn({
      netId: dukeNetID, firstName: given_name, lastName: family_name, handleResponse: handleOAuthSignOn,
    });
  };

  useEffect(() => {
    const authCode = getURLCode();

    // Axios request to express server to handle token
    const endpoint = '/api/oauthConsume';
    const path = `${route}${endpoint}`;
    axios.post(path, {
      code: authCode,
    })
      .then((res) => {
        const accessToken = res.data.result.access_token;
        const idToken = parseIdToken(res.data.result.id_token);
        ExpressQuery({
          endpoint: `/api/userinfo?accessToken=${accessToken}`, method: 'get', queryJSON: { }, handleResponse: handleUserInfoResponse,
        });

        const netId = idToken.sub;
        setNetID(netId);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // Empty dependency array, only run once on mount

  return (
    <>
      <h1>OAuth Consume Endpoint</h1>
      {netID && <h3>{`Welcome, ${netID}`}</h3>}
      <CircularProgress />
    </>
  );
}
