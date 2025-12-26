import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  age: number;
}

// In-memory storage
let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user1@gmail.com',
    age: 28,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user2@gmail.com',
    age: 34,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'user3@gmail.com',
    age: 25,
    createdAt: new Date().toISOString(),
  }
];
let nextId = 4;

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    createdAt: String!
  }

  type Query {
    hello: String
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    user: (_: any, { id }: { id: string }) => 
      users.find(user => user.id === id) || null,
    users: () => users,
  },

  Mutation: {
    createUser: (_: any, { input }: { input: CreateUserInput }): User => {
      const newUser: User = {
        id: nextId.toString(),
        name: input.name,
        email: input.email,
        age: input.age,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      nextId++;
      return newUser;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer();