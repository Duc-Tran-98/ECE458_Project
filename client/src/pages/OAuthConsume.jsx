import React, { useEffect, useState } from 'react';
import axios from 'axios';

// const jwt_decode = require('jwt-decode');
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import OAuthSignOn from '../queries/OAuthSignOn';

// TODO: Wire route based on dev/production (nginx proxy, see examples)
// TODO: Check if user exists, or add them to database on first login
export default function OAuthConsume() {
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
  };

  useEffect(() => {
    const authCode = getURLCode();
    console.log(authCode);

    // Axios request to express server to handle token
    axios.post('http://localhost:4001/api/oauthConsume', {
      code: authCode,
    })
      .then((res) => {
        console.log(res);
        const idToken = parseIdToken(res.data.result.id_token);
        console.log('idToken');
        console.log(idToken);
        const netId = idToken.sub;
        setNetID(netId);
        OAuthSignOn({ netId, handleResponse: handleOAuthSignOn });
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
