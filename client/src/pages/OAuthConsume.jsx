import React, { useEffect } from 'react';
import axios from 'axios';

export default function OAuthConsume() {
  const getURLCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    return code;
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
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // Empty dependency array, only run once on mount

  return (
    <>
      <h1>OAuth Consume Endpoint</h1>
    </>
  );
}
