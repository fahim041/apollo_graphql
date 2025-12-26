import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { helloTypeDefs, helloResolvers } from "./hello/index";
import { userTypeDefs, userResolvers } from "./users/index";
import { baseTypeDefs } from "./schema/index";

// Combine all type definitions
const typeDefs = [
    baseTypeDefs,
    helloTypeDefs,
    userTypeDefs,
];

// Combine all resolvers
const resolvers = {
    Query: {
        ...helloResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    
    console.log(`Server ready at: ${url}`);
}

startServer();
