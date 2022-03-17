import { api } from '@/services/api';
import Router from 'next/router';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

type User = {
  email: string;
  permissions: string[];
  roles: string[];
} | null;

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, `nextauth.token`);
  destroyCookie(undefined, `nextauth.refreshToken`);

  Router.push(`/`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api
        .get(`/me`)
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post(`/sessions`, { email, password });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, `nextauth.token`, token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: `/`,
      });
      setCookie(undefined, `nextauth.refreshToken`, refreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: `/`,
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers[`Authorization`] = `Bearer ${token}`;

      Router.push(`/dashboard`);
    } catch (err) {
      console.error(`@SignIn Error`, err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
