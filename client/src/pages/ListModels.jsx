import { useState, useContext } from 'react';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import Query from '../components/UseQuery';
import { DisplayGrid } from '../components/UITable';
import UserContext from '../components/UserContext';
import ErrorPage from './ErrorPage';

function ListModels() {
  const user = useContext(UserContext);
  if (!user.isLoggedIn) {
    return <ErrorPage message="You need to sign in to see this page!" />;
  }
  const [rows, setModels] = useState([]);
  const GET_MODELS_QUERY = gql`
    query Models{
      getAllModels{
        id
        vendor
        modelNumber
        description
        calibrationFrequency
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getAllModels';
  const handleResponse = (response) => {
    // console.log(response);
    setModels(response);
  };
  if (rows.length === 0) {
    Query({ query, queryName, handleResponse });
  }
  const cols = [
    { field: 'id', headerName: 'Numb', width: 50 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'modelNumber', headerName: 'Model Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'calibrationFrequency', headerName: 'Calibration Frequency', width: 200 },
  ];
  return DisplayGrid({ rows, cols });
}
export default ListModels;
