import React from 'react';
import Button from 'react-bootstrap/Button';

export default function OAuthLogin() {
  const getAuthCodeRequest = () => {
    const baseURL = process.env.REACT_APP_OAUTH_REQUEST_URL ? process.env.REACT_APP_OAUTH_REQUEST_URL : 'https://oauth.oit.duke.edu/oidc/authorize';
    const redirectURI = encodeURI(process.env.REACT_APP_OAUTH_REDIRECT_URI);
    const requestURL = `${baseURL}?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code`;
    return requestURL;
  };

  const submitAuthCodeRequest = (authCodeRequest) => {
    window.location.href = authCodeRequest;
  };

  const handleOAuth = () => {
    console.log('Handling OAuth login');

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
