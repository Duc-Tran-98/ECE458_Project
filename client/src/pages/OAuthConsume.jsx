import React, { useEffect } from 'react';

const request = require('sync-request');

export default function OAuthConsume() {
  const getURLCode = (authCodeResponse) => {
    const urlParams = new URLSearchParams(authCodeResponse);
    const code = urlParams.get('code');
    return code;
  };

  const formatAuthString = () => {
    const authString = `${process.env.REACT_APP_OAUTH_CLIENT_ID}:${process.env.REACT_APP_OAUTH_CLIENT_SECRET}`;
    return Buffer.from(authString).toString('base64');
  };

  const getToken = (code) => {
    const url = process.env.OAUTH_TOKEN_URL ? process.env.OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';
    const auth = formatAuthString();
    const redirectURI = encodeURI(process.env.REACT_APP_OATH_REDIRECT_URI);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: `grant_type=authorization_code&redirect_uri=${redirectURI}&code=${code}`,

    };

    const res = request('POST', url, options);
    let body = Buffer.from(res.getBody());
    body = body.toString();
    console.log('body');
    console.log(body);

    return body;
  };

  const parseIdToken = (token) => {
    const idToken = JSON.parse(token).id_token;
    // idToken = jwt_decode(idToken);
    return idToken;
  };

  useEffect(() => {
    const authCodeResponse = window.location.href;
    const authCode = getURLCode(authCodeResponse);
    console.log(authCode);

    // Exchange Auth Code for Auth Token
    const responseToken = getToken(authCode);
    console.log(responseToken);

    // Parse ID TOken (JWT)
    const idToken = parseIdToken(responseToken);
    console.log(idToken);
  }, []); // Empty dependency array, only run once on mount

  return (
    <>
      <h1>OAuth Consume Endpoint</h1>
    </>
  );
}
