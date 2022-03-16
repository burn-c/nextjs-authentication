import { api } from '@/services/api';
import Router from 'next/router';
import { createContext, ReactNode, useState } from 'react';

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

      const { token, refreshToke, permissions, roles } = response.data;

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
