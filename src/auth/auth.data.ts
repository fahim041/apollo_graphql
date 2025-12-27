// In-memory storage for refresh tokens (use database in production)
const refreshTokens = new Map<string, string>();

export const storeRefreshToken = (userId: string, token: string): void => {
  refreshTokens.set(userId, token);
};

export const getRefreshToken = (userId: string): string | undefined => {
  return refreshTokens.get(userId);
};

export const deleteRefreshToken = (userId: string): void => {
  refreshTokens.delete(userId);
};

export const validateStoredRefreshToken = (
  userId: string,
  token: string
): boolean => {
  const storedToken = refreshTokens.get(userId);
  return storedToken === token;
};
