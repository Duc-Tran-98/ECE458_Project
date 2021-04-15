import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default async function AddCustomFormCalibration({
  assetTag,
  user,
  date,
  comment,
  calibratedBy,
  customFormData,
  handleResponse,
}) {
  AddCustomFormCalibration.propTypes = {
    assetTag: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    customFormData: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    calibratedBy: PropTypes.array.isRequired,
  };
  const ADD_CUSTOM_CALIRBATION = gql`
  mutation AddCustomCalibration (
    $assetTag: Int!
    $date: String!
    $user: String!
    $comment: String
    $customFormData: String!
    $calibratedBy: [Int]
    ){
      addCustomCalibration(
      assetTag: $assetTag,
      date: $date,
      user: $user,
      comment: $comment,
      customFormData: $customFormData,
      calibratedBy: $calibratedBy
    )
  }
  `;
  const query = ADD_CUSTOM_CALIRBATION;
  const queryName = 'addCustomCalibration';
  const getVariables = () => ({
    assetTag,
    user,
    date,
    comment,
    customFormData,
    calibratedBy,
  });
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
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
    fetchPolicy: 'no-cache',
    refetchQueries,
  });
}
