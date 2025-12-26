import { useQuery } from '@apollo/client/react';
import type { User } from './types';
import { GET_USER } from './graphql/queries';

type GetUserQuery = {
  user: User | null;
};

type GetUserQueryVariables = {
  id: string;
};

export default function UserDetails({ userId }: { userId: string }) {
  const { loading, error, data } = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.user) return <p>User not found</p>;

  const user = data.user;

  return (
    <div>
      <h2>User Details</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Age:</strong> {user.age}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
