import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function OAuthSignOn({
  netId, firstName, lastName, handleResponse,
}) {
  OAuthSignOn.propTypes = {
    netId: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const OAUTH_SIGNON = gql`
    mutation OAuthSignOn($netId: String!, $firstName: String!, $lastName: String!) {
        oauthLogin(netId: $netId, firstName: $firstName, lastName: $lastName)
    }
  `;
  const query = print(OAUTH_SIGNON);
  const queryName = 'oauthLogin';
  const getVariables = () => ({ netId, firstName, lastName });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}
