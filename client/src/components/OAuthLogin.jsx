import React from 'react';
import Button from 'react-bootstrap/Button';

const PROD_URI = 'https://hpt.hopto.org/oauth/consume';
const CLIENT_ID = 'ece458_2021_s_ms724';
const myRedirectURI = process.env.NODE_ENV.includes('dev')
  ? process.env.REACT_APP_OAUTH_REDIRECT_URI_DEV
  : PROD_URI;

export default function OAuthLogin() {
  const getAuthCodeRequest = () => {
    const baseURL = 'https://oauth.oit.duke.edu/oidc/authorize';
    const redirectURI = encodeURI(myRedirectURI);
    const requestURL = `${baseURL}?client_id=${CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code`;
    return requestURL;
  };

  const submitAuthCodeRequest = (authCodeRequest) => {
    window.location.href = authCodeRequest;
  };

  const handleOAuth = () => {
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
