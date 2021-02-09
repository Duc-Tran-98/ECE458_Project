import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetAllInstruments({ handleResponse }) {
  GetAllInstruments.propTypes = {
    handleResponse: PropTypes.func,
  };
  const GET_INSTRUMENTS_QUERY = gql`
    query Instruments {
      getAllInstruments {
        id
        vendor
        modelNumber
        serialNumber
        description
        calibrationFrequency
      }
    }
  `;
  const query = print(GET_INSTRUMENTS_QUERY);
  const queryName = 'getAllInstruments';
  if (handleResponse) {
    Query({
      query,
      queryName,
      handleResponse,
    });
  } else {
    // eslint-disable-next-line no-return-await
    const response = await QueryAndThen({ query, queryName });
    // console.log(response);
    return response;
  }
}
