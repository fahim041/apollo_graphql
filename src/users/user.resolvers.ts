import { GraphQLError } from 'graphql';
import { users, nextId, incrementNextId } from './user.data';
import { User } from './user.types';

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
    users: () => users,
    user: (_: any, { id }: { id: string }) => {
      const user = users.find((user) => user.id === id);

      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return user;
    },
    usersByAge: (
      _: any,
      { minAge, maxAge }: { minAge?: number; maxAge?: number }
    ) => {
      return users.filter((user) => {
        if (minAge && user.age < minAge) return false;
        if (maxAge && user.age > maxAge) return false;
        return true;
      });
    },
  },
  Mutation: {
    createUser: (_: any, { input }: { input: CreateUserInput }) => {
      const newUser: User = {
        id: nextId.toString(),
        name: input.name,
        email: input.email,
        age: input.age,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      incrementNextId();
      return newUser;
    },
    updateUser: (
      _: any,
      { id, input }: { id: string; input: UpdateUserInput }
    ) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) return null;

      users[userIndex] = {
        ...users[userIndex],
        ...input,
      };
      return users[userIndex];
    },
    deleteUser: (_: any, { id }: { id: string }) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) return false;

      users.splice(userIndex, 1);
      return true;
    },
  },
};
