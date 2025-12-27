export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    age: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface Context {
  user?: JWTPayload;
}
