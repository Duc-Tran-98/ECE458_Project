import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function EditModelCategory({ currentName, updatedName, handleResponse }) {
  EditModelCategory.propTypes = {
    currentName: PropTypes.string.isRequired,
    updatedName: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const EDIT_MODEL_CAT = gql`
      mutation EditModelCategory($currentName: String!, $updatedName: String!) {
        editModelCategory(currentName: $currentName, updatedName: $updatedName)
      }
    `;
  const query = print(EDIT_MODEL_CAT);
  const queryName = 'editModelCategory';
  const getVariables = () => ({ currentName, updatedName });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
