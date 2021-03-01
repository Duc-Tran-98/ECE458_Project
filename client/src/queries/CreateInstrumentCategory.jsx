import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateInstrumentCategory({ name, handleResponse }) {
  CreateInstrumentCategory.propTypes = {
    name: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const CREATE_INST = gql`
      mutation AddInstrumentCategory($name: String!) {
        addInstrumentCategory(name: $name)
      }
    `;
  const query = print(CREATE_INST);
  const queryName = 'addInstrumentCategory';
  const getVariables = () => ({ name });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
