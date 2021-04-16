import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

/*
 approveCalibrationEvent(
      calibrationEventId: ID!
      approverId: ID!
      approvalDate: String!
      approvalComment: String
    ): String!
*/

export default function ApproveCalibEvent({
  handleResponse,
  calibrationEventId,
  approverId,
  approvalDate,
  approvalComment = '',
}) {
  ApproveCalibEvent.propTypes = {
    handleResponse: PropTypes.func.isRequired,
    calibrationEventId: PropTypes.string.isRequired,
    approverId: PropTypes.string.isRequired,
    approvalDate: PropTypes.string.isRequired,
    approvalComment: PropTypes.string,
  };
  const APPROVE_QUERY = gql`
    mutation Approve(
      $calibrationEventId: ID!
      $approverId: ID!
      $approvalDate: String!
      $approvalComment: String
    ) {
      approveCalibrationEvent(calibrationEventId: $calibrationEventId, approverId: $approverId, approvalDate: $approvalDate, approvalComment: $approvalComment )
    }
  `;
  const queryName = 'approveCalibrationEvent';
  const getVariables = () => ({
    calibrationEventId, approverId, approvalDate, approvalComment,
  });
  Query({
    query: APPROVE_QUERY,
    queryName,
    getVariables,
    handleResponse,
    fetchPolicy: 'no-cache',
  });
}
