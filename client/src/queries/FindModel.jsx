import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function FindModel({
  modelNumber, vendor, handleResponse,
}) {
  FindModel.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const FIND_MODEL = gql`
    query FindModel($modelNumber: String!, $vendor: String!) {
        getModel(modelNumber: $modelNumber, vendor: $vendor) {
        id
        description
        comment
        calibrationFrequency
        supportLoadBankCalibration
        supportKlufeCalibration
        supportCustomCalibration
        requiresCalibrationApproval
        customForm
        categories {
            name
        }
        calibratorCategories {
          name
        }
        }
    }
    `;
  const query = FIND_MODEL;
  const queryName = 'getModel';
  const getVariables = () => ({
    modelNumber,
    vendor,
  });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}

export function FindModelById({ id, handleResponse }) {
  FindModelById.propTypes = {
    id: PropTypes.number.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const FIND_MODEL = gql`
    query FindModel($id: Int!) {
      getModelById(id: $id) {
        description
        comment
        id
        modelNumber
        vendor
        calibrationFrequency
        supportLoadBankCalibration
        supportKlufeCalibration
        supportCustomCalibration
        requiresCalibrationApproval
        customForm
        categories {
          name
        }
        calibratorCategories {
          name
        }
      }
    }
  `;
  const query = FIND_MODEL;
  const queryName = 'getModelById';
  const getVariables = () => ({
    id,
  });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}
