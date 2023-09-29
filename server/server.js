import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first One",
    userId: "2",
  },
  {
    id: "2",
    text: "second One",
    userId: "1",
  },
];

let users = [
  { id: "1", firstName: "a", lastName: "bc", fullName: "abc" },
  { id: "2", firstName: "e", lastName: "fg" },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName and lastName
    """
    fullName: String!
  }
  """
  Tweet Object represents a resource of Tweet
  """
  type Tweet {
    id: ID!
    text: String
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    """
    Deletes a Teweet if it is found
    """
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allUsers() {
      console.log("allUsers Called");
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);

      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);

      return true;
    },
  },
  User: {
    fullName({ firstName, lastName, fullName }) {
      return fullName ? fullName : `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
