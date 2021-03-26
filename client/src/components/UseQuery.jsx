import PropTypes from 'prop-types';
// import axios from 'axios';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { print } from 'graphql';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4000'
  : '/api';

const httpLink = createHttpLink({
  uri: route,
});
let authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: '',
  },
}));
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getInstrumentByAssetTag(_, { args, toReference }) {
          return toReference({
            __typename: 'Instrument',
            id: args.id,
          });
        },
        getInstrumentById(_, { args, toReference }) {
          return toReference({
            __typename: 'Instrument',
            id: args.id,
          });
        },
        getModel(_, { args, toReference }) {
          return toReference({
            __typename: 'Model',
            id: args.id,
          });
        },
        getModelById(_, { args, toReference }) {
          return toReference({
            __typename: 'Model',
            id: args.id,
          });
        },
      },
    },
  },
});
let client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export function setAuthHeader(token) { // This is to let backend know request are coming from the user who logged in via our website
  // axios.defaults.headers.post.authorization = token || '';
  client.clearStore();
  authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  }));
  client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
  console.log('updated client obj');
}

const Query = ({
  query,
  queryName,
  getVariables,
  handleResponse,
  handleError,
  fetchPolicy = null,
  refetchQueries = [],
  update = () => null,
}) => {
  Query.propTypes = {
    query: PropTypes.string.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
    handleResponse: PropTypes.func.isRequired, // This is what to do with the response
    handleError: PropTypes.func,
    fetchPolicy: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    refetchQueries: PropTypes.array,
    update: PropTypes.func,
  };
  let response;
  // const data = getVariables ? { query, variables: getVariables() } : { query };
  // axios
  //   .post(route, data)
  //   .then((res) => {
  //     response = (typeof res.data.data[queryName] === 'string') ? JSON.parse(res.data.data[queryName]) : res.data.data[queryName];
  //     handleResponse(response);
  //   })
  //   .catch((err) => {
  //     if (handleError) handleError(err);
  //     console.error(err);
  //     console.error(err.response);
  //   });
  console.log(`use query called for query: ${queryName}`);
  if (print(query).includes('mutation')) {
    client
      .mutate({
        mutation: query,
        variables: getVariables(),
        refetchQueries,
        update,
      })
      .then((res) => {
        response = typeof res.data[queryName] === 'string'
          ? JSON.parse(res.data[queryName])
          : res.data[queryName];
        handleResponse(response);
      })
      .catch((err) => {
        if (handleError) handleError(err);
        console.error(err);
        console.error(err.response);
      });
  } else {
    client
      .query({
        query,
        variables: getVariables(),
        fetchPolicy,
      })
      .then((res) => {
        response = typeof res.data[queryName] === 'string'
          ? JSON.parse(res.data[queryName])
          : res.data[queryName];
        handleResponse(response);
      })
      .catch((err) => {
        if (handleError) handleError(err);
        console.error(err);
        console.error(err.response);
      });
  }
};

export async function QueryAndThen({
  query,
  queryName,
  getVariables = () => null,
  fetchPolicy = null,
  refetchQueries = [],
}) {
  QueryAndThen.propTypes = {
    query: PropTypes.string.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
    fetchPolicy: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    refetchQueries: PropTypes.array,

  };
  // const data = getVariables ? { query, variables: getVariables() } : { query };
  // eslint-disable-next-line no-return-await
  // return await axios
  //   .post(route, data)
  //   .then((res) => (typeof res.data.data[queryName] === 'string'
  //     ? JSON.parse(res.data.data[queryName])
  //     : res.data.data[queryName]))
  //   .catch((err) => {
  //     console.error(err);
  //     console.error(err.response);
  //   });
  console.log(`queryAndThen called for query: ${queryName}`);
  if (print(query).includes('mutation')) {
    return client
      .mutate({
        mutation: query,
        variables: getVariables(),
        refetchQueries,
      })
      .then((res) => (typeof res.data[queryName] === 'string'
        ? JSON.parse(res.data[queryName])
        : res.data[queryName]))
      .catch((err) => {
        console.error(err);
        console.error(err.response);
      });
  }
  return client
    .query({
      query,
      variables: getVariables(),
      fetchPolicy,
    })
    .then((res) => (typeof res.data[queryName] === 'string'
      ? JSON.parse(res.data[queryName])
      : res.data[queryName]))
    .catch((err) => {
      console.error(err);
      console.error(err.response);
    });
}

export default Query;
