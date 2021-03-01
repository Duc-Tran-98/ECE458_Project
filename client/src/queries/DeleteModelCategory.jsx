import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function DeleteModelCategory({ name, handleResponse }) {
  DeleteModelCategory.propTypes = {
    name: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const DEL_MODEL = gql`
      mutation removeModelCategory($name: String!) {
        removeModelCategory(name: $name)
      }
    `;
  const query = print(DEL_MODEL);
  const queryName = 'removeModelCategory';
  const getVariables = () => ({ name });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
