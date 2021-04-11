/* eslint-disable react/forbid-prop-types */
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query, { QueryAndThen } from '../components/UseQuery';

export default async function GetAllPendingCalibEvents({
  handleResponse = null,
  limit,
  offset,
  fetchPolicy = null,
}) {
  GetAllPendingCalibEvents.propTypes = {
    handleResponse: PropTypes.func,
    limit: PropTypes.number,
    offset: PropTypes.number,
    fetchPolicy: PropTypes.string,
  };
  const GET_PENDING = gql`
    query Pending(
      $limit: Int
      $offset: Int
    ) {
      getAllPendingCalibrationEvents(
        limit: $limit
        offset: $offset
      ) {
        id
        calibrationHistoryIdReference
        user
        userFirstName
        userLastName
        date
        comment
        fileLocation
        fileName
        loadBankData
        klufeData
        customFormData
      }
    }
  `;
  const queryName = 'getAllPendingCalibrationEvents';
  const query = GET_PENDING;
  const getVariables = () => ({
    limit,
    offset,
  });
  if (handleResponse) {
    Query({
      query,
      queryName,
      handleResponse,
      getVariables,
      fetchPolicy,
    });
  } else {
    // eslint-disable-next-line no-return-await
    const response = await QueryAndThen({
      query,
      queryName,
      getVariables,
      fetchPolicy,
    });
    return response;
  }
}
