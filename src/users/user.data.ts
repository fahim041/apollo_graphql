import { User } from './user.types';

export let users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user1@gmail.com',
    age: 28,
    password: '123456',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user2@gmail.com',
    age: 34,
    password: '123456',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'user3@gmail.com',
    age: 25,
    password: '123456',
    createdAt: new Date().toISOString(),
  }
];

export let nextId = 4;

export function incrementNextId() {
    nextId++;
}