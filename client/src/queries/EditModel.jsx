import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function EditModelQuery({
  id,
  modelNumber,
  vendor,
  description,
  comment,
  calibrationFrequency,
  supportLoadBankCalibration,
  supportKlufeCalibration,
  supportCustomCalibration,
  requiresCalibrationApproval,
  customForm,
  categories,
  calibratorCategories,
  handleResponse,
}) {
  EditModelQuery.propTypes = {
    id: PropTypes.number.isRequired,
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    calibrationFrequency: PropTypes.number.isRequired,
    supportLoadBankCalibration: PropTypes.bool.isRequired,
    supportKlufeCalibration: PropTypes.bool.isRequired,
    supportCustomCalibration: PropTypes.bool.isRequired,
    requiresCalibrationApproval: PropTypes.bool.isRequired,
    customForm: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    calibratorCategories: PropTypes.array.isRequired,
  };
  const EDIT_MODEL = gql`
        mutation EditModel(
            $modelNumber: String!
            $vendor: String!
            $description: String!
            $comment: String
            $calibrationFrequency: Int
            $supportLoadBankCalibration: Boolean!
            $supportKlufeCalibration: Boolean!
            $requiresCalibrationApproval: Boolean!
            $supportCustomCalibration: Boolean!
            $customForm: String
            $categories: [String]
            $calibratorCategories: [String]
            $id: ID!
        ) {
            editModel(
            modelNumber: $modelNumber
            vendor: $vendor
            comment: $comment
            description: $description
            calibrationFrequency: $calibrationFrequency
            supportLoadBankCalibration: $supportLoadBankCalibration
            supportKlufeCalibration: $supportKlufeCalibration
            requiresCalibrationApproval: $requiresCalibrationApproval
            supportCustomCalibration: $supportCustomCalibration
            customForm: $customForm
            categories: $categories
            calibratorCategories: $calibratorCategories
            id: $id
            ){
              message
              success
              model {
                id
                vendor
                modelNumber
                description
                comment
                calibrationFrequency
                categories {
                  name
                }
                calibratorCategories {
                  name
                }
                supportLoadBankCalibration
                supportKlufeCalibration
                supportCustomCalibration
                requiresCalibrationApproval
                customForm
              }
            }
        }
    `;
  const query = EDIT_MODEL;
  const refetch = JSON.parse(window.sessionStorage.getItem('getModelsWithFilter')) || null;
  const refetchQueries = refetch !== null
    ? [
      {
        query: refetch.query,
        variables: refetch.variables,
      },
    ]
    : [];
  const queryName = 'editModel';
  const getVariables = () => ({
    description,
    comment,
    calibrationFrequency,
    supportLoadBankCalibration,
    supportKlufeCalibration,
    supportCustomCalibration,
    requiresCalibrationApproval,
    customForm,
    id,
    modelNumber,
    vendor,
    categories,
    calibratorCategories,
  });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
    refetchQueries,
  });
}
