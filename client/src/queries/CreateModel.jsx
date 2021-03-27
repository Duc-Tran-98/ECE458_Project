import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateModel({
  modelNumber, vendor, description, comment, calibrationFrequency, supportLoadBankCalibration, supportKlufeCalibration, handleResponse, categories,
}) {
  CreateModel.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    calibrationFrequency: PropTypes.number.isRequired,
    supportLoadBankCalibration: PropTypes.bool.isRequired,
    supportKlufeCalibration: PropTypes.bool.isRequired,
    comment: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
  };
  const ADD_MODEL = gql`
      mutation AddModel(
        $modelNumber: String!
        $vendor: String!
        $description: String!
        $comment: String
        $calibrationFrequency: Int
        $supportLoadBankCalibration: Boolean!
        $supportKlufeCalibration: Boolean!
        $categories: [String]
      ) {
        addModel(
          modelNumber: $modelNumber
          vendor: $vendor
          comment: $comment
          description: $description
          calibrationFrequency: $calibrationFrequency
          supportLoadBankCalibration: $supportLoadBankCalibration
          supportKlufeCalibration: $supportKlufeCalibration
          categories: $categories
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
            supportLoadBankCalibration
            supportKlufeCalibration
          }
        }
      }
    `;
  const query = ADD_MODEL;
  const queryName = 'addModel';
  const refetch = JSON.parse(window.sessionStorage.getItem('getModelsWithFilter')) || null;
  const refetchQueries = refetch !== null
    ? [
      {
        query: refetch.query,
        variables: refetch.variables,
      },
    ]
    : [];
  const getVariables = () => ({
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
    supportLoadBankCalibration,
    supportKlufeCalibration,
    categories,
  });
  Query({
    query, queryName, getVariables, handleResponse, refetchQueries,
  });
}
