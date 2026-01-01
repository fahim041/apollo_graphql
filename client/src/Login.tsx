import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from './graphql/auth';

type LoginMutationResult = {
  login: {
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

type LoginVariables = {
  input: {
    email: string;
    password: string;
  };
};

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { loading, error }] = useMutation<LoginMutationResult, LoginVariables>(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem('accessToken', data.login.accessToken);
      localStorage.setItem('refreshToken', data.login.refreshToken);
      onLoginSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({
        variables: {
          input: { email, password },
        },
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type='submit' disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error.message}</p>}
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        Test credentials: user1@gmail.com / password123
      </p>
    </div>
  );
}
