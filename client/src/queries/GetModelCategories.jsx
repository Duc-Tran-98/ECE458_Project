import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetModelCategories({ limit, offset }) {
  GetModelCategories.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
  };
  const GET_MODEL_CATEGORIES_QUERY = gql`
    query Models($limit: Int, $offset: Int) {
        getModelCategories(limit: $limit, offset: $offset) {
          name
        }
    }
  `;
  const query = print(GET_MODEL_CATEGORIES_QUERY);
  const queryName = 'getModelCategories';
  const getVariables = () => ({ limit, offset });
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}
