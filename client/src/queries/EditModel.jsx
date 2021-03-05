import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function EditModelQuery({
  id,
  modelNumber,
  vendor,
  description,
  comment,
  calibrationFrequency,
  categories,
  handleResponse,
}) {
  EditModelQuery.propTypes = {
    id: PropTypes.number.isRequired,
    modelNumber: PropTypes.string.isRequired,
    vendor: PropTypes.string.isRequired,
    calibrationFrequency: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    categories: PropTypes.array.isRequired,
  };
  const EDIT_MODEL = gql`
        mutation EditModel(
            $modelNumber: String!
            $vendor: String!
            $description: String!
            $comment: String
            $calibrationFrequency: Int
            $categories: [String]
            $id: Int!
        ) {
            editModel(
            modelNumber: $modelNumber
            vendor: $vendor
            comment: $comment
            description: $description
            calibrationFrequency: $calibrationFrequency
            categories: $categories
            id: $id
            )
        }
    `;
  const query = print(EDIT_MODEL);
  const queryName = 'editModel';
  const getVariables = () => ({
    description,
    comment,
    calibrationFrequency,
    id,
    modelNumber,
    vendor,
    categories,
  });
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
