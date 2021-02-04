import PropTypes from 'prop-types';
import axios from 'axios';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4000'
  : '/api';

const Query = ({
  query, queryName, getVariables, handleResponse,
}) => {
  Query.propTypes = {
    query: PropTypes.string.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
    handleResponse: PropTypes.func.isRequired, // This is what to do with the response
  };
  let response;
  const data = getVariables ? { query, variables: getVariables() } : { query };
  axios
    .post(route, data)
    .then((res) => {
      // console.log(res);
      response = JSON.parse(res.data.data[queryName]);
      // console.log(response);
      handleResponse(response);
    })
    .catch((err) => console.error(err));
};

export default Query;
