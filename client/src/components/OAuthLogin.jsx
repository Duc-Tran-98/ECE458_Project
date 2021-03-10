import React from 'react';
import Button from 'react-bootstrap/Button';

const myRedirectURI = process.env.NODE_ENV.includes('dev')
  ? process.env.REACT_APP_OAUTH_REDIRECT_URI_DEV
  : process.env.REACT_APP_OAUTH_REDIRECT_URI_PROD;

export default function OAuthLogin() {
  const getAuthCodeRequest = () => {
    const baseURL = process.env.REACT_APP_OAUTH_REQUEST_URL ? process.env.REACT_APP_OAUTH_REQUEST_URL : 'https://oauth.oit.duke.edu/oidc/authorize';
    const redirectURI = encodeURI(myRedirectURI);
    const requestURL = `${baseURL}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code`;
    return requestURL;
  };

  const submitAuthCodeRequest = (authCodeRequest) => {
    console.log(authCodeRequest);
    // window.location.href = authCodeRequest;
  };

  const handleOAuth = () => {
    console.log('Handling OAuth login with process env: ');
    console.log(process.env);

    // Get Auth Code
    const authCodeRequest = getAuthCodeRequest();
    console.log(authCodeRequest);
    submitAuthCodeRequest(authCodeRequest);
  };

  return (
    <>
      <Button onClick={handleOAuth}>Login via Shibboleth</Button>
    </>
  );
}
