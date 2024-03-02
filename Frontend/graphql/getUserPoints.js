const { gql, ApolloClient } = require('@apollo/client');
const { apolloClient } = require('./apollo');

async function getUserPoint(address) {
  try {
    const response = await apolloClient.query({
      query: gql`
        query GetUserPoints($address: String!) {
          getUserPoints(address: $address) {
            points
          }
        }
      `,
      variables: {
        address,
      },
    });

    // Extract points from the response
    const userPoints = response.data.getUserPoints.points;
    // console.log('userPoint', userPoints);
    // Return the user points
    return userPoints;
  } catch (error) {
    console.error('Error fetching user points:', error.message);
    throw new Error('Internal Server Error');
  }
}

module.exports = {
  getUserPoint,
};
