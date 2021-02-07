import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function DeleteInstrument({
  id, handleResponse,
}) {
  DeleteInstrument.propTypes = {
    id: PropTypes.number.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const DEL_INST = gql`
    mutation DeleteInstrument($id: Int!) {
      deleteInstrument(id: $id)
    }
  `;
  const query = print(DEL_INST);
  const queryName = 'deleteInstrument';
  const getVariables = () => ({ id });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}