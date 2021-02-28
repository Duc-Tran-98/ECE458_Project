import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

export default async function GetInstrumentCategories({ limit, offset }) {
  GetInstrumentCategories.propTypes = {
    limit: PropTypes.number,
    offset: PropTypes.number,
  };
  const GET_INSTRUMENT_CATEGORIES_QUERY = gql`
    query Instruments($limit: Int, $offset: Int) {
        getAllInstrumentCategories(limit: $limit, offset: $offset) {
          id
          name
        }
    }
  `;
  const query = print(GET_INSTRUMENT_CATEGORIES_QUERY);
  const queryName = 'getAllInstrumentCategories';
  const getVariables = () => ({ limit, offset });
  const response = await QueryAndThen({ query, queryName, getVariables });
  console.log(response);
  return response;
}

export async function CountInstrumentCategories() {
  const query = print(gql`
        query Count{
            countInstrumentCategories
        }
    `);
  const queryName = 'countInstrumentCategories';
  const response = await QueryAndThen({ query, queryName });
  return response;
}
