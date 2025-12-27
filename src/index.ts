import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { helloTypeDefs, helloResolvers } from './hello/index';
import { userTypeDefs, userResolvers } from './users/index';
import { authTypeDefs, authResolvers } from './auth/index';
import { createContext } from './context';

// Base type definitions
const baseTypeDefs = `#graphql
  type Query
  type Mutation
`;

// Combine all type definitions
const typeDefs = [baseTypeDefs, helloTypeDefs, userTypeDefs, authTypeDefs];

// Combine all resolvers
const resolvers = {
  Query: {
    ...helloResolvers.Query,
    ...userResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    const code =
      error instanceof GraphQLError
        ? error.extensions?.code
        : 'INTERNAL_SERVER_ERROR';

    return {
      message: formattedError.message,
      code: code || 'INTERNAL_SERVER_ERROR',
    };
  },
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: createContext,
  });

  console.log(`Server ready at: ${url}`);
}

startServer();
