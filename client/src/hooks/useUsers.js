import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client.js';

export function useUsers(pollInterval = 30000) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, pollInterval);
    return () => clearInterval(interval);
  }, [fetchUsers, pollInterval]);

  return { users, loading, error, refetch: fetchUsers };
}
