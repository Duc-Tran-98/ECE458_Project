import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function EditInstrumentQuery({
  modelNumber, vendor, assetTag, serialNumber, id, comment, categories, handleResponse,
}) {
  EditInstrumentQuery.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    assetTag: PropTypes.number.isRequired,
    serialNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
    handleResponse: PropTypes.func,
  };
  EditInstrumentQuery.defaultProps = {
    handleResponse: null,
  };
  const EDIT_INST = gql`
    mutation EditInst(
      $modelNumber: String!
      $vendor: String!
      $assetTag: Int!
      $serialNumber: String!
      $comment: String
      $categories: [String]
      $id: ID!
    ) {
      editInstrument(
        modelNumber: $modelNumber
        vendor: $vendor
        assetTag: $assetTag
        serialNumber: $serialNumber
        comment: $comment
        categories: $categories
        id: $id
      ) {
        message
        success
        instrument {
          vendor
          modelNumber
          serialNumber
          modelReference
          calibrationFrequency
          comment
          description
          id
          assetTag
          supportLoadBankCalibration
          supportKlufeCalibration
          instrumentCategories {
            name
          }
        }
      }
    }
  `;
  const query = EDIT_INST;
  const refetch = JSON.parse(
    window.sessionStorage.getItem('getInstrumentsWithFilter'),
  ) || null;
  console.log(refetch);
  const refetchQueries = (refetch !== null) ? [{
    query: refetch.query,
    variables: refetch.variables,
  }] : [];
  const queryName = 'editInstrument';
  const getVariables = () => ({
    modelNumber,
    vendor,
    assetTag,
    serialNumber,
    id,
    comment,
    categories,
  });
  if (handleResponse) {
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
      refetchQueries,
    });
  } else {
    // eslint-disable-next-line no-return-await
    return await QueryAndThen({
      query, queryName, getVariables, refetchQueries,
    });
  }
}
