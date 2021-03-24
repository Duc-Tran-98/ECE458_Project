import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateModelCategory({ name, handleResponse }) {
  CreateModelCategory.propTypes = {
    name: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const CREATE_MODEL = gql`
      mutation AddModelCategory($name: String!) {
        addModelCategory(name: $name)
      }
    `;
  const query = CREATE_MODEL;
  const queryName = 'addModelCategory';
  const getVariables = () => ({ name });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
