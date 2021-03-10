import PropTypes from 'prop-types';
import axios from 'axios';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4000'
  : '/api';

export function setAuthHeader(token) { // This is to let backend know request are coming from the user who logged in via our website
  axios.defaults.headers.post.authorization = token || '';
  console.log(`set auth header = ${token}`);
}

const Query = ({ // TODO: MAKE SURE REQUEST ARE SECURED WITH TOKEN
  query, queryName, getVariables, handleResponse, handleError,
}) => {
  Query.propTypes = {
    query: PropTypes.string.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
    handleResponse: PropTypes.func.isRequired, // This is what to do with the response
    handleError: PropTypes.func,
  };
  let response;
  const data = getVariables ? { query, variables: getVariables() } : { query };
  console.log(data);
  axios
    .post(route, data)
    .then((res) => {
      response = (typeof res.data.data[queryName] === 'string') ? JSON.parse(res.data.data[queryName]) : res.data.data[queryName];
      handleResponse(response);
    })
    .catch((err) => {
      if (handleError) handleError(err);
      console.error(err);
      console.error(err.response);
    });
};

export async function QueryAndThen({
  query,
  queryName,
  getVariables,
}) {
  QueryAndThen.propTypes = {
    query: PropTypes.string.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
  };
  const data = getVariables ? { query, variables: getVariables() } : { query };
  // eslint-disable-next-line no-return-await
  return await axios
    .post(route, data)
    .then((res) => (typeof res.data.data[queryName] === 'string'
      ? JSON.parse(res.data.data[queryName])
      : res.data.data[queryName]))
    .catch((err) => {
      console.error(err);
      console.error(err.response);
    });
}

export default Query;
