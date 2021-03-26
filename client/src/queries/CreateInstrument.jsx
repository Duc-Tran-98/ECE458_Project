import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function CreateInstrument({
  modelNumber, vendor, assetTag, serialNumber, comment, categories, handleResponse,
}) {
  CreateInstrument.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    assetTag: PropTypes.number,
    serialNumber: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
    handleResponse: PropTypes.func,
  };
  CreateInstrument.defaultProps = {
    handleResponse: null,
  };
  const ADD_INSTRUMENT = gql`
      mutation AddInstrument(
        $modelNumber: String!
        $vendor: String!
        $assetTag: Int
        $serialNumber: String!
        $comment: String
        $categories: [String]
      ) {
        addInstrument(
          modelNumber: $modelNumber
          vendor: $vendor
          assetTag: $assetTag
          comment: $comment
          serialNumber: $serialNumber
          categories: $categories
        ){
          message
          success
          instrument {
            vendor
            modelNumber
            serialNumber
            modelReference
            calibrationFrequency
            comment
            instrumentCategories {
              name
            }
            description
            id
            assetTag
            supportLoadBankCalibration
            supportKlufeCalibration
          }
        }
      }
    `;
  const query = ADD_INSTRUMENT;
  const queryName = 'addInstrument';
  const getVariables = () => ({
    modelNumber, vendor, assetTag, serialNumber, comment, categories,
  });
  if (handleResponse) {
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  } else {
    // eslint-disable-next-line no-return-await
    return await QueryAndThen({ query, queryName, getVariables });
  }
}
