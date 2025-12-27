export const authTypeDefs = `#graphql
  type AuthPayload {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    age: Int!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout: Boolean!
  }
`;
