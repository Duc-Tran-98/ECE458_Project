import { gql } from '@apollo/client';
import { print } from 'graphql';
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
  const query = print(GET_MODEL_CATEGORIES_QUERY);
  const queryName = 'getAllModelCategories';
  const getVariables = () => ({ limit, offset, orderBy });
  const response = await QueryAndThen({ query, queryName, getVariables });
  // console.log(response);
  return response;
}

export async function CountModelCategories() {
  const query = print(gql`
        query Count{
            countModelCategories
        }
    `);
  const queryName = 'countModelCategories';
  const response = await QueryAndThen({ query, queryName });
  return response;
}

export async function CountModelsAttached({ name }) {
  const query = print(gql`
        query Count($name: String!){
          countModelsAttachedToCategory(name: $name)
        }
    `);
  const getVariables = () => ({ name });
  const queryName = 'countModelsAttachedToCategory';
  const response = await QueryAndThen({ query, queryName, getVariables });
  return response;
}
