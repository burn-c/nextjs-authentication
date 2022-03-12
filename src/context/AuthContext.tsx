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
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(email, password);
        resolve();
      }, 1000);
    });
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
