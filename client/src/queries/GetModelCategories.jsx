import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetModelCategories({ limit, offset, orderBy }) {
  GetModelCategories.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    orderBy: PropTypes.array,
  };
  const GET_MODEL_CATEGORIES_QUERY = gql`
    query Models($limit: Int, $offset: Int, $orderBy: [[String]]) {
        getAllModelCategories(limit: $limit, offset: $offset, orderBy: $orderBy) {
          id
          name
        }
    }
  `;
  const query = GET_MODEL_CATEGORIES_QUERY;
  const queryName = 'getAllModelCategories';
  const getVariables = () => ({ limit, offset, orderBy });
  const response = await QueryAndThen({
    query,
    queryName,
    getVariables,
    fetchPolicy: 'no-cache',
  });
  // console.log(response);
  return response;
}

export async function CountModelCategories() {
  const query = gql`
        query Count{
            countModelCategories
        }
    `;
  const queryName = 'countModelCategories';
  const response = await QueryAndThen({ query, queryName, fetchPolicy: 'no-cache' });
  return response;
}

export async function CountModelsAttached({ name }) {
  const query = gql`
        query Count($name: String!){
          countModelsAttachedToCategory(name: $name)
        }
    `;
  const getVariables = () => ({ name });
  const queryName = 'countModelsAttachedToCategory';
  const response = await QueryAndThen({
    query,
    queryName,
    getVariables,
    fetchPolicy: 'no-cache',
  });
  return response;
}
