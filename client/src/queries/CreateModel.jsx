import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateModel({
  modelNumber, vendor, description, comment, calibrationFrequency, handleResponse, categories,
}) {
  CreateModel.propTypes = {
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    calibrationFrequency: PropTypes.number.isRequired,
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
        $categories: [String]
      ) {
        addModel(
          modelNumber: $modelNumber
          vendor: $vendor
          comment: $comment
          description: $description
          calibrationFrequency: $calibrationFrequency
          categories: $categories
        )
      }
    `;
  const query = print(ADD_MODEL);
  const queryName = 'addModel';
  const getVariables = () => ({
    modelNumber,
    vendor,
    description,
    comment,
    calibrationFrequency,
    categories,
  });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
