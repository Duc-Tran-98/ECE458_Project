import React, { useContext } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import ErrorPage from './ErrorPage';
import UserContext from '../components/UserContext';
import Query from '../components/UseQuery';

function ListModels() {
  const user = useContext(UserContext);
  const GET_MODELS_QUERY = gql`
    query Models{
      getAllModels{
        vendor
        modelNumber
        modelId
        description
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getAllModels';
  const handleResponse = (response) => {
    console.log(response);
  };
  Query({ query, queryName, handleResponse });
  if (!user.isLoggedIn) {
    return <ErrorPage message="You need to sign in first!" />;
  }
  return (<div className="d-flex justify-content-center"><h2>stuff</h2></div>);
}
export default ListModels;
