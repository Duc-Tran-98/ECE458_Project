/* eslint-disable react/forbid-prop-types */
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetAllModels({
  limit, offset, vendor, modelNumber, description, categories, orderBy, fetchPolicy = null,
}) {
  GetAllModels.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
    vendor: PropTypes.string,
    modelNumber: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    orderBy: PropTypes.array,
    fetchPolicy: PropTypes.string,
  };
  const GET_MODELS_QUERY = gql`
    query Models(
      $limit: Int
      $offset: Int
      $vendor: String
      $modelNumber: String
      $description: String
      $categories: [String]
      $orderBy: [[String]]
    ) {
      getModelsWithFilter(
        limit: $limit
        offset: $offset
        vendor: $vendor
        modelNumber: $modelNumber
        description: $description
        categories: $categories
        orderBy: $orderBy
      ) {
        models {
          id
          vendor
          modelNumber
          description
          calibrationFrequency
          supportLoadBankCalibration
          requiresCalibrationApproval
          supportCustomCalibration
          customForm
          comment
          categories {
            name
          }
        }
        total
      }
    }
  `;
  const query = GET_MODELS_QUERY;
  const queryName = 'getModelsWithFilter';
  const getVariables = () => ({
    limit, offset, vendor, modelNumber, description, categories, orderBy,
  });
  window.sessionStorage.setItem(
    'getModelsWithFilter',
    JSON.stringify({
      query,
      variables: getVariables(),
    }),
  );
  const response = await QueryAndThen({
    query, queryName, getVariables, fetchPolicy,
  });
  return response;
}

export async function CountAllModels() {
  const query = gql`
        query CountModels{
            countAllModels
        }
    `;
  const queryName = 'countAllModels';
  const response = await QueryAndThen({ query, queryName, fetchPolicy: 'no-cache' });
  return response;
}
