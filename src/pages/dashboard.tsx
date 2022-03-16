import { api } from '@/services/api';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    api.get(`/me`).then((response) => {
      console.log(response.data);
    });
  }, []);
  return <h1>Dashboard</h1>;
}
