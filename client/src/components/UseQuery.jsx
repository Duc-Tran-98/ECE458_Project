import PropTypes from 'prop-types';
// import axios from 'axios';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  // eslint-disable-next-line no-unused-vars
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { print } from 'graphql';

const route = process.env.NODE_ENV.includes('dev')
  ? 'http://localhost:4000'
  : '/api';

const wsRoute = process.env.NODE_ENV.includes('dev')
  ? 'ws://localhost:4000/graphql'
  : 'wss://backend:4000/graphql';

const httpLink = new HttpLink({
  uri: route,
});

const wsLink = new WebSocketLink({
  uri: wsRoute,
  options: {
    reconnect: true,
  },
});
let authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: '',
  },
}));
let splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);
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
  link: splitLink,
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
  splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );
  client = new ApolloClient({
    link: splitLink,
    cache,
  });
}

const Query = ({
  query,
  queryName,
  getVariables,
  handleResponse,
  handleError,
  fetchPolicy = null, // fetchPolicy: 'no-cache' for no caching of results
  refetchQueries = [],
  update = null,
  awaitRefetchQueries = false,
}) => {
  Query.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    query: PropTypes.object.isRequired, // This is the gql query printed
    queryName: PropTypes.string.isRequired, // This is the name of the query
    getVariables: PropTypes.func, // This is how we get the variables to pass into the query
    handleResponse: PropTypes.func.isRequired, // This is what to do with the response
    handleError: PropTypes.func,
    fetchPolicy: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    refetchQueries: PropTypes.array,
    update: PropTypes.func,
    awaitRefetchQueries: PropTypes.bool,
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
  if (print(query).includes('mutation')) {
    client
      .mutate({
        mutation: query,
        variables: getVariables(),
        refetchQueries,
        fetchPolicy,
        update,
        awaitRefetchQueries,
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
        console.log(err.message);
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
    // eslint-disable-next-line react/forbid-prop-types
    query: PropTypes.object.isRequired, // This is the gql query printed
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
  if (print(query).includes('mutation')) {
    return client
      .mutate({
        mutation: query,
        variables: getVariables(),
        refetchQueries,
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

export function Subscribe({ query, getVariables = () => undefined }) {
  Subscribe.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    query: PropTypes.object,
    getVariables: PropTypes.func,
  };
  return client.subscribe({
    query,
    variables: getVariables(),
    fetchPolicy: 'no-cache',
  });
}

export default Query;
