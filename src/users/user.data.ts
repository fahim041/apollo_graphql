import { User } from './user.types';

export let users: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
        createdAt: new Date().toISOString(),
    },
];

export let nextId = 3;

export function incrementNextId() {
    nextId++;
}