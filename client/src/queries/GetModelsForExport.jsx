import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetModelsForExport({ filterOptions }) {
  GetModelsForExport.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    filterOptions: PropTypes.object.isRequired,
  };
  const GET_MODELS_QUERY = gql`
    query Models(
      $vendor: String
      $modelNumber: String
      $description: String
      $categories: [String]
    ) {
      getModelsWithFilter(
        vendor: $vendor
        modelNumber: $modelNumber
        description: $description
        categories: $categories
      ){
          models{
          vendor
          modelNumber
          description
          comment
          calibrationFrequency
          categories{
            name
          }
          supportLoadBankCalibration
          supportKlufeCalibration
        }
      }
    }
  `;
  const query = GET_MODELS_QUERY;
  const queryName = 'getModelsWithFilter';
  const vendor = typeof filterOptions.vendors === 'undefined' ? null : filterOptions.vendors;
  const modelNumber = typeof filterOptions.modelNumbers === 'undefined' ? null : filterOptions.modelNumbers;
  const description = typeof filterOptions.descriptions === 'undefined' ? null : filterOptions.descriptions;
  // eslint-disable-next-line prefer-destructuring
  const categories = filterOptions.categories;

  const getVariables = () => ({
    vendor, modelNumber, description, categories,
  });
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}
