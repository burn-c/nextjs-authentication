import { useContext, useEffect } from 'react';

import { api } from '@/services/apiClient';
import { withSSRAuth } from '@/utils';
import { setupAPIClient } from '@/services/api';
import { AuthContext } from '@/context/AuthContext';
import { useCan } from '@/hooks';
import { Can } from '@/componentes';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const useCanSeeMetrics = useCan({
    permissions: [`metrics.list`],
  });

  useEffect(() => {
    api.get(`/me`).then((response) => {
      console.log(response?.data);
    });
  }, []);
  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      <Can permissions={[`metrics.list`]}>
        <h1>User has permission</h1>
      </Can>
      {useCanSeeMetrics && <h1>Metrics</h1>}
    </>
  );
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
