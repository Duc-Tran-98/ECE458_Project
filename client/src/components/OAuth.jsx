import React from 'react';
import Button from 'react-bootstrap/Button';

// import chalk from 'chalk';
// import reader from 'readline-sync';
// import request from 'sync-request';
// import jwt_decode from 'jwt-decode';

const chalk = require('chalk');
const reader = require('readline-sync');
const request = require('sync-request');
// eslint-disable-next-line camelcase
const jwt_decode = require('jwt-decode');

// require('dotenv').config();

export default function OAuth() {
  const formatAuthString = () => {
    const authString = `${process.env.REACT_APP_OAUTH_CLIENT_ID}:${process.env.REACT_APP_OAUTH_CLIENT_SECRET}`;
    return Buffer.from(authString).toString('base64');
  };

  const getToken = (code) => {
    const url = process.env.REACT_APP_OAUTH_TOKEN_URL ? process.env.REACT_APP_OAUTH_TOKEN_URL : 'https://oauth.oit.duke.edu/oidc/token';
    const auth = formatAuthString();
    const redireactURI = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: `grant_type=authorization_code&redirect_uri=${redireactURI}&code=${code}`,

    };

    const res = request('POST', url, options);
    let body = Buffer.from(res.getBody());
    body = body.toString();
    console.log('body');
    console.log(body);

    return body;
  };

  const parseIdToken = (token) => {
    let idToken = JSON.parse(token).id_token;
    idToken = jwt_decode(idToken);
    console.log(idToken);
  };

  const printAuthCodeRequest = () => {
    const baseURL = process.env.REACT_APP_OAUTH_REQUEST_URL ? process.env.REACT_APP_OAUTH_REQUEST_URL : 'https://oauth.oit.duke.edu/oidc/authorize';
    const redirectURI = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI);
    const requestURL = `${baseURL}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code`;

    console.log('Copy and paste this url into your web browser.');
    console.log(chalk.cyan(requestURL));
    const text = chalk.green('"code"');
    const code = chalk.green('m781z2');

    console.log(`Once you are redirected, copy the value of the ${text} parameter in the url.`);
    console.log(`For example: https://www.google.com/?code=${code}`);
  };

  const main = () => {
    console.log('\n\n');
    console.log(chalk.magenta('### STEP 1: Get Auth Code ###'));
    printAuthCodeRequest();
    console.log('\n\n');

    console.log(chalk.magenta('### STEP 2: Provide Auth Code ###'));
    const authCode = reader.question('paste oauth code: ');
    console.log('\n\n');
    console.log(authCode);

    console.log(chalk.magenta('### STEP 3: Exchange Auth Code for the Auth Token ###'));
    const responseToken = getToken(authCode);
    console.log('\n\n');

    console.log(chalk.magenta('### STEP 4: Parse ID Token(JWT) ###'));
    parseIdToken(responseToken);
  };

  const handleOAuth = () => {
    console.log('Handling OAuth login');
    // console.log(process.env);
    console.log(process.env.REACT_APP_OAUTH_CLIENT_ID);
    console.log(process.env.REACT_APP_OAUTH_CLIENT_SECRET);
    console.log(process.env.REACT_APP_OATH_REDIRECT_URI);
    main();
  };

  return (
    <>
      <Button onClick={handleOAuth}>Login</Button>
    </>
  );
}
