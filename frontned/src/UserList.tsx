import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import type { User } from './types';
import UserDetails from './UserDetails';
import UserForm from './UserForm';
import { GET_USERS } from './graphql/queries';

type GetUserQuery = {
  users: User[];
};

export default function UserList() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { loading, error, data } = useQuery<GetUserQuery>(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {data?.users.map((user: User) => (
          <li key={user.id} onClick={() => setSelectedUserId(user.id)}>
            <strong>{user.name}</strong> ({user.email}), Age: {user.age},
            Created At: {new Date(user.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>

      {selectedUserId && <UserDetails userId={selectedUserId} />}

      <UserForm />
    </div>
  );
}
