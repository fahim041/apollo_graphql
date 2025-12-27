import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { REGISTER } from './graphql/auth';

type RegisterMutationResult = {
  register: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      age: number;
    };
  };
};

type RegisterVariables = {
  input: {
    name: string;
    email: string;
    password: string;
    age: number;
  };
};

export default function Register({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');

  const [register, { loading, error }] = useMutation<RegisterMutationResult, RegisterVariables>(
    REGISTER,
    {
      onCompleted: (data) => {
        localStorage.setItem('accessToken', data.register.accessToken);
        localStorage.setItem('refreshToken', data.register.refreshToken);
        onRegisterSuccess();
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (age === '') return;

    try {
      await register({
        variables: {
          input: { name, email, password, age: Number(age) },
        },
      });
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Age:</label>
          <input
            type='number'
            value={age}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type='submit' disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error.message}</p>}
      </form>
    </div>
  );
}
