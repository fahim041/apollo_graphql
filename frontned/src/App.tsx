import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import UserList from './UserList';
import Login from './Login';
import Register from './Register';
import { LOGOUT } from './graphql/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  const [showRegister, setShowRegister] = useState(false);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    },
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Even if logout fails, clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>GraphQL Apollo Client - Authentication</h1>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowRegister(false)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: !showRegister ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: showRegister ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>
        {showRegister ? (
          <Register onRegisterSuccess={handleLoginSuccess} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>GraphQL Apollo Client</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <UserList />
    </div>
  );
}

export default App;
