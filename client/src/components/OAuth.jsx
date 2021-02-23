import React from 'react';
import Button from 'react-bootstrap/Button';

const request = require('sync-request');

export default function OAuth() {
  const getAuthCodeRequest = () => {
    const baseURL = process.env.REACT_APP_OAUTH_REQUEST_URL ? process.env.REACT_APP_OAUTH_REQUEST_URL : 'https://oauth.oit.duke.edu/oidc/authorize';
    const redirectURI = encodeURI(process.env.REACT_APP_OATH_REDIRECT_URI);
    const requestURL = `${baseURL}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code`;
    return requestURL;
  };

  const submitAuthCodeRequest = (authCodeRequest) => {
    window.location.href = authCodeRequest;
    const responseURL = window.location.href;
    return responseURL;
  };

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

  const handleOAuth = () => {
    console.log('Handling OAuth login');
    console.log(process.env.REACT_APP_OAUTH_CLIENT_ID);
    console.log(process.env.REACT_APP_OAUTH_CLIENT_SECRET);
    console.log(process.env.REACT_APP_OATH_REDIRECT_URI);

    // Get Auth Code
    const authCodeRequest = getAuthCodeRequest();
    console.log(authCodeRequest);
    const authCodeResponse = submitAuthCodeRequest(authCodeRequest);
    console.log(authCodeResponse);
    // const authCode = getURLCode(authCodeResponse);
    // console.log(authCode);

    // // Exchange Auth Code for Auth Token
    // const responseToken = getToken(authCode);
    // console.log(responseToken);

    // // Parse ID TOken (JWT)
    // const idToken = parseIdToken(responseToken);
    // console.log(idToken);
  };

  return (
    <>
      <Button onClick={handleOAuth}>Login</Button>
    </>
  );
}
