import React from 'react';
import {
  ApolloClient, InMemoryCache, gql, createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import XGridTest from '../components/XGridTest';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});
const authLink = setContext((_, { headers }) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwic3ViIjoiMSIsImlhdCI6MTYxNjUzNTEyNSwiZXhwIjoxNjE2NjIxNTI1fQ.t0trodFK6iTgqJ6W0J6ZerFp7kUdxAkBbramQrz1nP8';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function ComponentTest() {
  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={() => {
          client
            .query({
              query: gql`
            query Test {
              countAllModels
            }
          `,
            })
            .then((res) => {
              const result = typeof res.data.countAllModels === 'string' ? JSON.parse(res.data.countAllModels) : res.data.countAllModels;
              console.log(result);
            });
        }}
      >
        Click Me

      </button>
      <XGridTest />
    </>
  );
}
