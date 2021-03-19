import { gql } from '@apollo/client';
import { print } from 'graphql';
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
        categories {
            name
        }
        }
    }
    `;
  const query = print(FIND_MODEL);
  const queryName = 'getModel';
  const getVariables = () => ({
    modelNumber,
    vendor,
  });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
