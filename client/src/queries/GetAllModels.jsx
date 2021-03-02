import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetAllModels({ limit, offset }) {
  GetAllModels.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
  };
  const GET_MODELS_QUERY = gql`
    query Models($limit: Int, $offset: Int) {
      getModelsWithFilter(limit: $limit, offset: $offset) {
        id
        vendor
        modelNumber
        description
        calibrationFrequency
        comment
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getModelsWithFilter';
  const getVariables = () => ({ limit, offset });
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}

export async function CountAllModels() {
  const query = print(gql`
        query CountModels{
            countAllModels
        }
    `);
  const queryName = 'countAllModels';
  const response = await QueryAndThen({ query, queryName });
  return response;
}
