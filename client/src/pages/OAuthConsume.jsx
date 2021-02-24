import React, { useEffect } from 'react';

// const request = require('sync-request');
// eslint-disable-next-line camelcase
const jwt_decode = require('jwt-decode');

export default function OAuthConsume() {
  const parseIdToken = (token) => {
    let idToken = JSON.parse(token).id_token;
    idToken = jwt_decode(idToken);
    return idToken;
  };

  const parseTokenResponse = (response) => {
    console.log(response);
    parseIdToken(1235);
  };

  const getURLCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code;
  };

  const formatAuthString = () => {
    const authString = `${process.env.REACT_APP_OAUTH_CLIENT_ID}:${process.env.REACT_APP_OAUTH_CLIENT_SECRET}`;
    return Buffer.from(authString).toString('base64');
  };

  // const getToken = (code) => {
  //   const url = process.env.OAUTH_TOKEN_URL ? process.env.OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';
  //   const auth = formatAuthString();
  //   const redirectURI = encodeURI(process.env.REACT_APP_OATH_REDIRECT_URI);

  //   const options = {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: `Basic ${auth}`,
  //     },
  //     body: `grant_type=authorization_code&redirect_uri=${redirectURI}&code=${code}`,

  //   };

  //   const res = request('POST', url, options);
  //   let body = Buffer.from(res.getBody());
  //   body = body.toString();
  //   console.log('body');
  //   console.log(body);

  //   return body;
  // };

  const getTokenCors = (code) => {
    const url = process.env.OAUTH_TOKEN_URL ? process.env.OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';
    const auth = formatAuthString();
    const redirectURI = encodeURI(process.env.REACT_APP_OATH_REDIRECT_URI);

    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: `grant_type=authorization_code&redirect_uri=${redirectURI}&code=${code}`,
    };

    fetch(url, options)
      .then((res) => {
        parseTokenResponse(res);
      });
  };

  useEffect(() => {
    const authCode = getURLCode();
    console.log(authCode);

    // Exchange Auth Code for Auth Token
    getTokenCors(authCode);
    // const responseToken = getToken(authCode);
    // console.log(responseToken);
  }, []); // Empty dependency array, only run once on mount

  return (
    <>
      <h1>OAuth Consume Endpoint</h1>
    </>
  );
}
