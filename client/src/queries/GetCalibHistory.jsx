import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetCalibHistory({
  id, handleResponse,
}) {
  GetCalibHistory.propTypes = {
    id: PropTypes.number.isRequired,
    handleResponse: PropTypes.func,
  };
  // console.log(events);
  const GET_CALIB_HIST = gql`
    query GetCalibHist($id: Int!) {
      getCalibrationEventsByReferenceId(calibrationHistoryIdReference: $id) {
        date
        user
        comment
      }
    }
  `;
  const query = print(GET_CALIB_HIST);
  const queryName = 'getCalibrationEventsByReferenceId';
  const getVariables = () => ({ id });
  if (handleResponse) {
    Query({
      query, queryName, getVariables, handleResponse,
    });
  } else {
    // eslint-disable-next-line no-return-await
    const response = await QueryAndThen({ query, queryName, getVariables });
    response.sort((a, b) => new Date(b.date) - new Date(a.date)); // This will sort calib events by date (most recent to least recent)
    // console.log(response);
    return response;
  }
}
