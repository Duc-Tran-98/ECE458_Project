import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateInstrumentCategory({ name, handleResponse }) {
  CreateInstrumentCategory.propTypes = {
    name: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const CREATE_INST = gql`
    mutation AddInstrumentCategory($name: String!) {
      addInstrumentCategory(name: $name) {
        message
        success
        category {
          name
          id
        }
      }
    }
  `;
  const query = CREATE_INST;
  const queryName = 'addInstrumentCategory';
  const getVariables = () => ({ name });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
    fetchPolicy: 'no-cache',
  });
}
