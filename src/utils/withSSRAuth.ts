import { destroyAuthCookie } from '@/context/AuthContext';
import { AuthTokenError } from '@/services/errors/AuthTokenError';
import jwtDecode from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';
import { validateUserPermissions } from './validateUserPermissions';

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies[`nextauth.token`];

    if (!token) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }

    if (options) {
      const user = jwtDecode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;

      const userHasPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      if (!userHasPermissions) {
        return {
          redirect: {
            destination: `/dashboard`,
            permanent: false,
          },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyAuthCookie(ctx);

        return {
          redirect: {
            destination: `/`,
            permanent: false,
          },
        };
      }
    }
  };
}
