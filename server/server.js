import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";
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
    allMovies: [Movie!]!
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    """
    Deletes a Teweet if it is found
    """
    deleteTweet(id: ID!): Boolean!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
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
    async allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    async movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
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
