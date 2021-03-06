import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetCalibHistory({
  id, mostRecent, handleResponse, dateOnly,
}) {
  GetCalibHistory.propTypes = {
    // mostRecent only works if you don't pass a handler
    mostRecent: PropTypes.bool, // If true, only return the most recent calib event, if it exists
    id: PropTypes.number.isRequired, // ID of instrument
    handleResponse: PropTypes.func, // Handler
    dateOnly: PropTypes.bool, // If you only want the date
  };
  GetCalibHistory.defaultProps = {
    mostRecent: false,
    dateOnly: false,
  };
  const GET_DATE_HIST = gql`
    query GetCalibHist($id: Int!) {
      getCalibrationEventsByReferenceId(calibrationHistoryIdReference: $id) {
        date
      }
    }
  `;
  const GET_ALL_CALIB_HIST = gql`
    query GetCalibHist($id: Int!) {
      getCalibrationEventsByReferenceId(calibrationHistoryIdReference: $id) {
        date
        user
        comment
        fileLocation
        fileName
      }
    }
  `;
  const query = dateOnly ? print(GET_DATE_HIST) : print(GET_ALL_CALIB_HIST); // Pick which query to use
  const queryName = 'getCalibrationEventsByReferenceId';
  const getVariables = () => ({ id });
  if (handleResponse) { // If you passed a handler, call it
    Query({
      query, queryName, getVariables, handleResponse,
    });
  } else { // Else, return response
    const response = await QueryAndThen({ query, queryName, getVariables });
    if (response) { // If response isn't null
      response.sort((a, b) => new Date(b.date) - new Date(a.date)); // This will sort calib events by date (most recent to least recent)
      if (mostRecent) { // If you asked for most recent, return it
        return response[0];
      }
    }
    return response;
  }
}
