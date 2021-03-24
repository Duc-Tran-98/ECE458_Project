import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function DeleteModel({ modelNumber, vendor, handleResponse }) {
  DeleteModel.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const DEL_MODEL = gql`
      mutation DeletModel($modelNumber: String!, $vendor: String!) {
        deleteModel(modelNumber: $modelNumber, vendor: $vendor)
      }
    `;
  const query = DEL_MODEL;
  const queryName = 'deleteModel';
  const getVariables = () => ({ modelNumber, vendor });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
