import { gql } from '@apollo/client';
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
    mutation DeleteInstrument($id: ID!) {
      deleteInstrument(id: $id)
    }
  `;
  const query = DEL_INST;
  const queryName = 'deleteInstrument';
  const getVariables = () => ({ id });
  const refetch = JSON.parse(window.sessionStorage.getItem('getInstrumentsWithFilter'))
    || null;
  console.log(refetch);
  const refetchQueries = refetch !== null
    ? [
      {
        query: refetch.query,
        variables: refetch.variables,
      },
    ]
    : [];
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
    refetchQueries,
  });
}
