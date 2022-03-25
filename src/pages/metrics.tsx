import { withSSRAuth } from '@/utils';
import { setupAPIClient } from '@/services/api';

export default function Metrics() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get(`/me`);

    return {
      props: {},
    };
  },
  {
    permissions: [`metrics.list`],
    roles: [`administrator`],
  },
);
