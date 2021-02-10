import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default async function AddCalibEvent({
  events, handleResponse, modelNumber, vendor, serialNumber,
}) {
  AddCalibEvent.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    events: PropTypes.array.isRequired,
    handleResponse: PropTypes.func.isRequired,
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    serialNumber: PropTypes.string.isRequired,
  };
  const ADD_EVENT = gql`
      mutation AddEvent(
        $modelNumber: String!
        $vendor: String!
        $serialNumber: String!
        $date: String!
        $user: String! 
        $comment: String
      ) {
        addCalibrationEvent(
          modelNumber: $modelNumber
          vendor: $vendor
          comment: $comment
          serialNumber: $serialNumber
          user: $user
          date: $date
        )
      }
    `;
  const query = print(ADD_EVENT);
  const queryName = 'addCalibrationEvent';
  events.forEach((entry) => {
    const getVariables = () => ({
      modelNumber,
      vendor,
      serialNumber,
      comment: entry.comment,
      user: entry.user,
      date: entry.date,
    });
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  });
}

// addCalibrationEvent(modelNumber: String!, vendor: String!, serialNumber: String!, date: String!, user: String! comment: String)
