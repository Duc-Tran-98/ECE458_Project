import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default async function AddCalibEventByAssetTag({
  events,
  handleResponse,
  assetTag,
}) {
  AddCalibEventByAssetTag.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.array.isRequired,
    handleResponse: PropTypes.func.isRequired,
    assetTag: PropTypes.number.isRequired,
  };
  const ADD_EVENT = gql`
    mutation AddEvent(
      $assetTag: Int!
      $date: String!
      $user: String!
      $comment: String
      $fileLocation: String
      $fileName: String
      $calibratedBy: [Int]
    ) {
      addCalibrationEventByAssetTag(
        assetTag: $assetTag
        user: $user
        date: $date
        comment: $comment
        fileLocation: $fileLocation
        fileName: $fileName
        calibratedBy: $calibratedBy
      )
    }
  `;
  const query = ADD_EVENT;
  const queryName = 'addCalibrationEventByAssetTag';
  const refetch = JSON.parse(window.sessionStorage.getItem('getInstrumentsWithFilter'))
    || null;
  const refetchQueries = refetch !== null
    ? [
      {
        query: refetch.query,
        variables: refetch.variables,
      },
    ]
    : [];
  events.forEach((entry) => {
    const getVariables = () => ({
      assetTag,
      fileLocation: entry.fileLocation,
      fileName: entry.fileName,
      comment: entry.comment,
      user: entry.user,
      date: entry.date,
      calibratedBy: entry.calibratedBy,
    });
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
      fetchPolicy: 'no-cache',
      refetchQueries, // refetch so can change expiration date
    });
  });
}
