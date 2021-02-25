import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetAllInstruments({
  handleResponse, limit, offset,
}) {
  GetAllInstruments.propTypes = {
    handleResponse: PropTypes.func,
    limit: PropTypes.number,
    offset: PropTypes.number,
  };
  const GET_INSTRUMENTS_QUERY = gql`
    query Instruments($limit: Int, $offset: Int) {
      getInstrumentsWithFilter(limit: $limit, offset: $offset) {
        id
        vendor
        modelNumber
        serialNumber
        description
        calibrationFrequency
        comment
        recentCalibration {
          user
          date
          comment
        }
      }
    }
  `;
  const queryName = 'getInstrumentsWithFilter';
  const query = print(GET_INSTRUMENTS_QUERY);
  const getVariables = () => ({ limit, offset });
  if (handleResponse) {
    Query({
      query,
      queryName,
      handleResponse,
      getVariables,
    });
  } else {
    // eslint-disable-next-line no-return-await
    const response = await QueryAndThen({ query, queryName, getVariables });
    return response;
  }
}

export async function CountInstruments() {
  const query = print(gql`
    query Count{
      countAllInstruments
    }
  `);
  const queryName = 'countAllInstruments';
  const response = await QueryAndThen({ query, queryName });
  return response;
}
