import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

/*
  rejectCalibrationEvent(
      calibrationEventId: ID!
      approverId: ID!
      approvalDate: String!
      approvalComment: String
    ): String!
*/

export default function RejectCalibEvent({
  handleResponse,
  calibrationEventId,
  approverId,
  approvalDate,
  approvalComment = '',
}) {
  RejectCalibEvent.propTypes = {
    handleResponse: PropTypes.func.isRequired,
    calibrationEventId: PropTypes.string.isRequired,
    approverId: PropTypes.string.isRequired,
    approvalDate: PropTypes.string.isRequired,
    approvalComment: PropTypes.string,
  };
  const APPROVE_QUERY = gql`
    mutation Reject(
      $calibrationEventId: ID!
      $approverId: ID!
      $approvalDate: String!
      $approvalComment: String
    ) {
      rejectCalibrationEvent(
        calibrationEventId: $calibrationEventId
        approverId: $approverId
        approvalDate: $approvalDate
        approvalComment: $approvalComment
      )
    }
  `;
  const queryName = 'rejectCalibrationEvent';
  const getVariables = () => ({
    calibrationEventId,
    approverId,
    approvalDate,
    approvalComment,
  });
  Query({
    query: APPROVE_QUERY,
    queryName,
    getVariables,
    handleResponse,
    fetchPolicy: 'no-cache',
  });
}
