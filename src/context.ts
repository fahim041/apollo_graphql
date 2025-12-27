import { StandaloneServerContextFunctionArgument } from '@apollo/server/standalone';
import { verifyAccessToken } from './auth/auth.utils';
import { Context } from './auth/auth.types';

export async function createContext({
  req,
}: StandaloneServerContextFunctionArgument): Promise<Context> {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return {};
  }

  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch (error) {
    // Invalid token - return empty context
    return {};
  }
}
