# GraphQL Server

Testing out Apollo Server v5 with TypeScript.

## Features

- **Apollo Server v5** - Latest standalone server implementation
- **JWT Authentication** - Access and refresh token implementation with bcrypt password hashing
- **Modular Schema** - Feature-based organization with separate modules for users, auth, and hello
- **TypeScript** - Full type safety across resolvers and schema
- **Hot Reload** - tsx watch for automatic server restart on file changes

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production-min-32-chars
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:4000/graphql`

### Test Credentials

Login with existing users:
- Email: `user1@gmail.com`, Password: `password123`
- Email: `user2@gmail.com`, Password: `password123`
- Email: `user3@gmail.com`, Password: `password123`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Build and run production server

## GraphQL Operations

### Authentication

- `login(input: LoginInput!)` - Login and receive access/refresh tokens
- `register(input: RegisterInput!)` - Register new user
- `refreshToken(refreshToken: String!)` - Get new access token
- `logout` - Invalidate refresh token (requires auth)
- `me` - Get current user info (requires auth)

### Users

- `users` - List all users
- `user(id: ID!)` - Get user by ID
- `createUser(input: CreateUserInput!)` - Create new user
- `updateUser(id: ID!, input: UpdateUserInput!)` - Update user
- `deleteUser(id: ID!)` - Delete user

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── hello/          # Hello world example
├── schema/         # Base GraphQL schema
├── context.ts      # Apollo Server context
└── index.ts        # Server entry point
```
