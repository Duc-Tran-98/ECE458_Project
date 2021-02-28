import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import Query from '../components/UseQuery';

export default function OAuthSignOn({
  netId, handleResponse,
}) {
  OAuthSignOn.propTypes = {
    netId: PropTypes.string.isRequired,
    handleResponse: PropTypes.func.isRequired,
  };
  const OAUTH_SIGNON = gql`
    mutation OAuthSignOn($netId: String!) {
        oauthLogin(netId: $netId)
    }
  `;
  const query = print(OAUTH_SIGNON);
  const queryName = 'oauthLogin';
  const getVariables = () => ({ netId });
  Query({
    query,
    queryName,
    getVariables,
    handleResponse,
  });
}
