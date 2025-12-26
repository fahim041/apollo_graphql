export const userTypeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int!
        createdAt: String!
    }

    extend type Query {
        users: [User!]!
        user(id: ID!): User
        usersByAge(minAge: Int, maxAge: Int): [User!]!
    }

    extend type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): Boolean!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int!
    }

    input UpdateUserInput {
        name: String
        email: String
        age: Int
    }
`;