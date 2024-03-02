const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

module.exports = {
  apolloClient,
};
