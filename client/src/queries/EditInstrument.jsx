import { gql } from '@apollo/client';
import { print } from 'graphql';
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
    mutation EditInst($modelNumber: String!, $vendor: String!, $assetTag: Int!, $serialNumber: String!, $comment: String, $categories: [String], $id: Int!) {
      editInstrument(modelNumber: $modelNumber, vendor: $vendor, assetTag: $assetTag, serialNumber: $serialNumber, comment: $comment, categories: $categories, id: $id)
    }
  `;
  const query = print(EDIT_INST);
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
    });
  } else {
    // eslint-disable-next-line no-return-await
    return await QueryAndThen({ query, queryName, getVariables });
  }
}
