import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import { signOut } from '@/context/AuthContext';

let isRefreshing = false;
// eslint-disable-next-line prefer-const
let failedRequestsQueue = [];

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: `http://localhost:3333`,
    headers: {
      Authorization: `Bearer ${cookies[`nextauth.token`]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401) {
        // Refresh token
        console.log(`Refreshing token - 401`);
        if (error.response?.data?.code === `token.expired`) {
          cookies = parseCookies(ctx);

          const { 'nextauth.refreshToken': refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;
            console.log(
              `Refreshing token -------------------------------------`,
            );

            api
              .post(`/refresh`, { refreshToken })
              .then((response) => {
                const { token } = response.data;

                setCookie(ctx, `nextauth.token`, token, {
                  maxAge: 30 * 24 * 60 * 60, // 30 days
                  path: `/`,
                });

                setCookie(
                  ctx,
                  `nextauth.refreshToken`,
                  response.data.refreshToken,
                  {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: `/`,
                  },
                );

                api.defaults.headers[`Authorization`] = `Bearer ${token}`;

                failedRequestsQueue.forEach((request) =>
                  request.onSuccess(token),
                );
                failedRequestsQueue = [];
              })
              .catch((error) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFailure(error),
                );
                failedRequestsQueue = [];

                signOut();
              })
              .finally(() => {
                isRefreshing = false;
              });
          }
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers[`Authorization`] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error);
              },
            });
          });
        } else {
          signOut();
        }
      }
      return Promise.reject(error);
    },
  );
  return api;
}
