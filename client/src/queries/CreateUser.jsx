import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function CreateUser({
  firstName,
  lastName,
  email,
  password,
  userName,
  isAdmin,
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
  };
  const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
      $email: String!
      $password: String!
      $firstName: String!
      $lastName: String!
      $userName: String!
      $isAdmin: Boolean!
    ) {
      signup(
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        userName: $userName
        isAdmin: $isAdmin
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
  });
  const query = print(SIGNUP_MUTATION);
  const queryName = 'signup';
  Query({
    query, queryName, getVariables, handleResponse,
  });
}
