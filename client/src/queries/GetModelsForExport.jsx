import { gql } from '@apollo/client';
import { print } from 'graphql';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetModelsForExport() {
  const GET_MODELS_QUERY = gql`
    query Models {
      getAllModels{
        vendor
        modelNumber
        description
        comment
        calibrationFrequency
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getAllModels';

  const response = await QueryAndThen({ query, queryName });
  return response;
}
