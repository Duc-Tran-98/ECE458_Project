import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function EditInstrumentCategory({ currentName, updatedName, handleResponse }) {
  EditInstrumentCategory.propTypes = {
    currentName: PropTypes.string.isRequired,
    updatedName: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const EDIT_INST_CAT = gql`
      mutation EditInstrumentCategory($currentName: String!, $updatedName: String!) {
        editInstrumentCategory(currentName: $currentName, updatedName: $updatedName)
      }
    `;
  const query = print(EDIT_INST_CAT);
  const queryName = 'editInstrumentCategory';
  const getVariables = () => ({ currentName, updatedName });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
