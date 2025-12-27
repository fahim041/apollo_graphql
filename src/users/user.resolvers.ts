import { GraphQLError } from 'graphql';
import { users, nextId, incrementNextId } from './user.data';
import { User } from './user.types';
import { requireAuth } from '../auth/auth.middleware';
import { Context } from '../auth/auth.types';
import { hashPassword } from '../auth/auth.utils';

// GraphQL resolver types
interface CreateUserInput {
  name: string;
  email: string;
  age: number;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  age?: number;
}

export const userResolvers = {
  Query: {
    users: (_parent: unknown, _args: unknown, context: Context) => {
      requireAuth(context);
      
      // Return users without password field
      return users.map(({ password, ...user }) => user);
    },
    user: (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context);
      
      const user = users.find((user) => user.id === id);

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
    usersByAge: (
      _parent: unknown,
      { minAge, maxAge }: { minAge?: number; maxAge?: number }
    ) => {
      const filteredUsers = users.filter((user) => {
        if (minAge && user.age < minAge) return false;
        if (maxAge && user.age > maxAge) return false;
        return true;
      });

      // Return users without password field
      return filteredUsers.map(({ password, ...user }) => user);
    },
  },
  Mutation: {
    createUser: async (_parent: unknown, { input }: { input: CreateUserInput }, context: Context) => {
      requireAuth(context); // Require authentication

      const newUser: User = {
        id: nextId.toString(),
        name: input.name,
        email: input.email,
        password: await hashPassword('password123'),
        age: input.age,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      incrementNextId();

      // Don't return password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    },
    updateUser: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      context: Context
    ) => {
      requireAuth(context); // Require authentication

      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      users[userIndex] = {
        ...users[userIndex],
        ...input,
      };

      // Don't return password
      const { password, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword;
    },
    deleteUser: (_parent: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context); // Require authentication

      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) return false;

      users.splice(userIndex, 1);
      return true;
    },
  },
};
