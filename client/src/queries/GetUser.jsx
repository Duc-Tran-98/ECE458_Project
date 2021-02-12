import { gql } from '@apollo/client';
import { print } from 'graphql';
import PropTypes from 'prop-types';
import { QueryAndThen } from '../components/UseQuery';

const GET_USER = gql`
    query GetUser($userName: String!){
        getUser(userName: $userName){
            firstName
            lastName
        }
    }
`;

const query = print(GET_USER);
const queryName = 'getUser';

export default function GetUser({ userName }) {
  GetUser.propTypes = {
    userName: PropTypes.string.isRequired,
  };
  const getVariables = () => ({ userName });
  const response = QueryAndThen({ query, queryName, getVariables });
  return response;
}
