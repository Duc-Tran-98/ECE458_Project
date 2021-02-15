import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function EditInstrumentQuery({
  modelNumber, vendor, serialNumber, id, comment, handleResponse,
}) {
  EditInstrumentQuery.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    serialNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    handleResponse: PropTypes.func,
  };
  EditInstrumentQuery.defaultProps = {
    handleResponse: null,
  };
  const EDIT_INST = gql`
    mutation EditInst($modelNumber: String!, $vendor: String!, $serialNumber: String!, $comment: String, $id: Int!) {
      editInstrument(modelNumber: $modelNumber, vendor: $vendor, serialNumber: $serialNumber, comment: $comment, id: $id)
    }
  `;
  const query = print(EDIT_INST);
  const queryName = 'editInstrument';
  const getVariables = () => ({
    modelNumber,
    vendor,
    serialNumber,
    id,
    comment,
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

/*
editInstrument(
      modelNumber: String!
      vendor: String!
      comment: String
      serialNumber: String!
      id: Int!
    )
*/
