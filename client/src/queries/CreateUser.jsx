import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateUser({
  firstName,
  lastName,
  email,
  password,
  userName,
  isAdmin,
  modelPermission,
  instrumentPermission,
  calibrationPermission,
  handleResponse,
}) {
  CreateUser.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    handleResponse: PropTypes.func.isRequired,
    modelPermission: PropTypes.bool.isRequired,
    instrumentPermission: PropTypes.bool.isRequired,
    calibrationPermission: PropTypes.bool.isRequired,
  };
  const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $userName: String!
      $isAdmin: Boolean!
      $modelPermission: Boolean!
      $instrumentPermission: Boolean!
      $calibrationPermission: Boolean!
    ) {
      signup(
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        userName: $userName
        isAdmin: $isAdmin
        modelPermission: $modelPermission
        instrumentPermission: $instrumentPermission
        calibrationPermission: $calibrationPermission
      )
    }
  `;
  const getVariables = () => ({
    firstName,
    lastName,
    email,
    password,
    userName,
    isAdmin,
    modelPermission,
    instrumentPermission,
    calibrationPermission,
  });
  const query = SIGNUP_MUTATION;
  const queryName = 'signup';
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}
