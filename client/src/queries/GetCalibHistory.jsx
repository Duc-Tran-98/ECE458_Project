import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export async function GetCalibHistByAssetTag({
  modelNumber, vendor, assetTag, handleResponse = null, mostRecent = false,
}) {
  GetCalibHistByAssetTag.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    assetTag: PropTypes.number.isRequired,
    handleResponse: PropTypes.func,
    mostRecent: PropTypes.bool,
  };
  const GET_ALL_CALIB_HIST = gql`
    query GetCalibHist($modelNumber: String!, $vendor: String!, $assetTag: Int!) {
      getCalibrationEventsByInstrument(modelNumber: $modelNumber, vendor: $vendor, assetTag: $assetTag) {
        date
        user
        comment
        fileLocation
        fileName
        loadBankData
        klufeData
      }
    }
  `;
  const query = GET_ALL_CALIB_HIST; // Pick which query to use
  const queryName = 'getCalibrationEventsByReferenceId';
  const getVariables = () => ({ modelNumber, vendor, assetTag });
  if (handleResponse) { // If you passed a handler, call it
    Query({
      query, queryName, getVariables, handleResponse, fetchPolicy: 'no-cache',
    });
  } else { // Else, return response
    const response = await QueryAndThen({
      query,
      queryName,
      getVariables,
      fetchPolicy: 'no-cache',
    });
    if (response) { // If response isn't null
      response.sort((a, b) => new Date(b.date) - new Date(a.date)); // This will sort calib events by date (most recent to least recent)
      if (mostRecent) { // If you asked for most recent, return it
        return response[0];
      }
    }
    return response;
  }
}

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
        loadBankData
        klufeData
      }
    }
  `;
  const query = dateOnly ? GET_DATE_HIST : GET_ALL_CALIB_HIST; // Pick which query to use
  const queryName = 'getCalibrationEventsByReferenceId';
  const getVariables = () => ({ id });
  if (handleResponse) { // If you passed a handler, call it
    Query({
      query, queryName, getVariables, handleResponse,
    });
  } else { // Else, return response
    const response = await QueryAndThen({
      query,
      queryName,
      getVariables,
      fetchPolicy: 'no-cache',
    });
    const copyOfRes = JSON.parse(JSON.stringify(response));
    if (copyOfRes) { // If response isn't null
      copyOfRes.sort((a, b) => new Date(b.date) - new Date(a.date)); // This will sort calib events by date (most recent to least recent)
      if (mostRecent) { // If you asked for most recent, return it
        return copyOfRes[0];
      }
    }
    return copyOfRes;
  }
}
