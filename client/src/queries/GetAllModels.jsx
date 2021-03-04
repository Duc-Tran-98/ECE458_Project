import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetAllModels({
  limit, offset, vendor, modelNumber, description, categories,
}) {
  GetAllModels.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
    description: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array,
  };
  const GET_MODELS_QUERY = gql`
    query Models(
      $limit: Int
      $offset: Int
      $vendor: String
      $modelNumber: String
      $description: String
      $categories: [String]
    ) {
      getModelsWithFilter(
        limit: $limit
        offset: $offset
        vendor: $vendor
        modelNumber: $modelNumber
        description: $description
        categories: $categories
      ) {
        models {
          id
          vendor
          modelNumber
          description
          calibrationFrequency
          comment
        }
        total
      }
    }
  `;
  const query = print(GET_MODELS_QUERY);
  const queryName = 'getModelsWithFilter';
  const getVariables = () => ({
    limit, offset, vendor, modelNumber, description, categories,
  });
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
