import { GraphQLError } from 'graphql';
import { LoginInput, RegisterInput, AuthPayload, Context } from './auth.types';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './auth.utils';
import {
  storeRefreshToken,
  deleteRefreshToken,
  validateStoredRefreshToken,
} from './auth.data';
import { findUserByEmail, findUserById, createUser } from '../users/user.data';

export const authResolvers = {
  Query: {
    me: (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const user = findUserById(context.user.userId);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Don't return password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },
  },
  Mutation: {
    register: async (_: any, { input }: { input: RegisterInput }): Promise<AuthPayload> => {
      // Check if user already exists
      const existingUser = findUserByEmail(input.email);
      if (existingUser) {
        throw new GraphQLError('User with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(input.password);

      // Create user
      const newUser = createUser({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        age: input.age,
      });

      // Generate tokens
      const payload = { userId: newUser.id, email: newUser.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Store refresh token
      storeRefreshToken(newUser.id, refreshToken);

      // Don't return password
      const { password, ...userWithoutPassword } = newUser;

      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    },

    login: async (_: any, { input }: { input: LoginInput }): Promise<AuthPayload> => {
      // Find user by email
      const user = findUserByEmail(input.email);
      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Verify password
      const isValidPassword = await comparePassword(input.password, user.password);
      if (!isValidPassword) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Generate tokens
      const payload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // Store refresh token
      storeRefreshToken(user.id, refreshToken);

      // Don't return password
      const { password, ...userWithoutPassword } = user;

      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    },

    refreshToken: async (
      _: any,
      { refreshToken }: { refreshToken: string }
    ): Promise<AuthPayload> => {
      // Verify refresh token
      let payload;
      try {
        payload = verifyRefreshToken(refreshToken);
      } catch (error) {
        throw new GraphQLError('Invalid or expired refresh token', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Validate stored refresh token
      const isValid = validateStoredRefreshToken(payload.userId, refreshToken);
      if (!isValid) {
        throw new GraphQLError('Invalid refresh token', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Find user
      const user = findUserById(payload.userId);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Generate new tokens
      const newPayload = { userId: user.id, email: user.email };
      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      // Update stored refresh token
      storeRefreshToken(user.id, newRefreshToken);

      // Don't return password
      const { password, ...userWithoutPassword } = user;

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userWithoutPassword,
      };
    },

    logout: (_: any, __: any, context: Context): boolean => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Delete refresh token
      deleteRefreshToken(context.user.userId);

      return true;
    },
  },
};
