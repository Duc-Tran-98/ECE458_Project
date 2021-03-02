import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function ChangePassword({
  userName, oldPassword, newPassword, handleResponse,
}) {
  ChangePassword.propTypes = {
    userName: PropTypes.string.isRequired,
    oldPassword: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const CHANGE_PASS = gql`
    mutation changePassword($userName: String!, $oldPassword: String!, $newPassword: String!) {
        changePassword(userName: $userName, oldPassword: $oldPassword, newPassword: $newPassword)
    }
  `;
  const query = print(CHANGE_PASS);
  const queryName = 'oauthLogin';
  const getVariables = () => ({ userName, oldPassword, newPassword });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}