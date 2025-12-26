import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { GET_USERS, CREATE_USER } from './graphql/queries';

type CreateUserInput = {
  name: string;
  email: string;
  age: number;
};

type CreateUserMutation = {
  createUser: {
    id: string;
    name: string;
    email: string;
    age: number;
    createdAt: string;
  };
};

export default function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');

  const [createUser, { data, loading, error }] = useMutation<
    CreateUserMutation,
    { input: CreateUserInput }
  >(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setName('');
      setEmail('');
      setAge('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (age === '') return;

    try {
      await createUser({
        variables: {
          input: {
            name,
            email,
            age: Number(age),
          },
        },
      });
    } catch (err) {
      console.error('Mutation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type='number'
          value={age}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
          required
        />
      </div>
      <button type='submit' disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && <p style={{ color: 'green' }}>User {data.createUser.name} created successfully!</p>}
    </form>
  );
}
