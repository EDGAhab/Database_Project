import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        console.log(data)
        setUsers(data);
      } catch (err) {
        console.log("something")
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.UserID}>{user.Name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
