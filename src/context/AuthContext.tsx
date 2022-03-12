import { api } from '@/services/api';
import { createContext, ReactNode } from 'react';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = false;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      await api.post(`/sessions`, { email, password });
    } catch (err) {
      console.error(`@SignIn Error`, err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
