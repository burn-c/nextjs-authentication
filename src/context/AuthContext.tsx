import { api } from '@/services/api';
import Router from 'next/router';
import { createContext, ReactNode, useState } from 'react';
import { setCookie } from 'nookies';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

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
