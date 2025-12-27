import { GraphQLError } from 'graphql';
import { Context } from './auth.types';

export const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
};
