import { User } from './user.types';

export let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user1@gmail.com',
    age: 28,
    password: '$2b$10$NPJJYFRYpyBGPr2RvOxKnOSgvs2oSP0p9jLydDsjq2d8umZvnqjBq', // password123
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user2@gmail.com',
    age: 34,
    password: '$2b$10$NPJJYFRYpyBGPr2RvOxKnOSgvs2oSP0p9jLydDsjq2d8umZvnqjBq', // password123
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'user3@gmail.com',
    age: 25,
    password: '$2b$10$NPJJYFRYpyBGPr2RvOxKnOSgvs2oSP0p9jLydDsjq2d8umZvnqjBq', // password123
    createdAt: new Date().toISOString(),
  },
];

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const createUser = (input: Omit<User, 'id' | 'createdAt'>): User => {
  const maxId = users.reduce((max, user) => {
    const id = parseInt(user.id);
    return id > max ? id : max;
  }, 0);

  const newUser: User = {
    id: String(maxId + 1),
    ...input,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
};

export let nextId = 4;

export function incrementNextId() {
  nextId++;
}
