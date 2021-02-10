import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function CreateInstrument({
  modelNumber, vendor, serialNumber, comment, handleResponse,
}) {
  CreateInstrument.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    serialNumber: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    handleResponse: PropTypes.func,
  };
  CreateInstrument.defaultProps = {
    handleResponse: null,
  };
  const ADD_INSTRUMENT = gql`
      mutation AddInstrument(
        $modelNumber: String!
        $vendor: String!
        $serialNumber: String!
        $comment: String
      ) {
        addInstrument(
          modelNumber: $modelNumber
          vendor: $vendor
          comment: $comment
          serialNumber: $serialNumber
        )
      }
    `;
  const query = print(ADD_INSTRUMENT);
  const queryName = 'addInstrument';
  const getVariables = () => ({
    modelNumber, vendor, serialNumber, comment,
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
