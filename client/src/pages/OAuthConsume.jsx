/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// const jwt_decode = require('jwt-decode');
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import OAuthSignOn from '../queries/OAuthSignOn';
import ExpressQuery from '../queries/ExpressQuery';

// TODO: Wire route based on dev/production (nginx proxy, see examples)
export default function OAuthConsume({ handleLogin }) {
  OAuthConsume.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  const [netID, setNetID] = useState('');

  function parseIdToken(token) {
    console.log(token);
    const idToken = jwt_decode(token);
    return idToken;
  }

  const getURLCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code;
  };

  const handleOAuthSignOn = (response) => {
    console.log('Handling OAuth Sign On');
    console.log(response);
    window.sessionStorage.setItem(
      'token',
      Buffer.from(response.netId, 'ascii').toString('base64'),
    );
    handleLogin();
    window.location.href = '/';
  };

  const handleUserInfoResponse = (response) => {
    const {
      dukeNetID, given_name, family_name, sub,
    } = response.data.result;
    console.log(`dukeID: ${dukeNetID}, given_name: ${given_name}, family_name: ${family_name}, sub: ${sub}`);

    OAuthSignOn({
      netId: dukeNetID, firstName: given_name, lastName: family_name, handleResponse: handleOAuthSignOn,
    });
  };

  useEffect(() => {
    const authCode = getURLCode();

    // Axios request to express server to handle token
    axios.post('http://localhost:4001/api/oauthConsume', {
      code: authCode,
    })
      .then((res) => {
        const accessToken = res.data.result.access_token;
        const idToken = parseIdToken(res.data.result.id_token);
        ExpressQuery({
          route: `/api/userinfo?accessToken=${accessToken}`, method: 'get', queryJSON: { }, handleResponse: handleUserInfoResponse,
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
      <h3>{`Welcome, ${netID}`}</h3>
    </>
  );
}
