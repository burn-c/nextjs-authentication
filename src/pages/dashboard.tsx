import { useEffect } from 'react';

import { api } from '@/services/apiClient';
import { withSSRAuth } from '@/utils';
import { setupAPIClient } from '@/services/api';

export default function Dashboard() {
  useEffect(() => {
    api.get(`/me`).then((response) => {
      console.log(response?.data);
    });
  }, []);
  return <h1>Dashboard</h1>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get(`/me`);
  console.log(response?.data);
  return {
    props: {},
  };
});
