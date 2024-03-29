import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function DeleteInstrumentCategory({ name, handleResponse }) {
  DeleteInstrumentCategory.propTypes = {
    name: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const DEL_INST = gql`
      mutation removeInstrumentCategory($name: String!) {
        removeInstrumentCategory(name: $name)
      }
    `;
  const query = DEL_INST;
  const queryName = 'removeInstrumentCategory';
  const getVariables = () => ({ name });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
    fetchPolicy: 'no-cache',
  });
}
