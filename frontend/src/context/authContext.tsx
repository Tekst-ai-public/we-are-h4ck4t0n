'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext } from 'react';
import { AuthLoading } from '@/app/(auth)/components/AuthLoading';

type AuthContextProps = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  login: async () => {
    throw new Error('Login function not implemented');
  },
  logout: async () => {
    throw new Error('Logout function not implemented');
  },
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();

  async function login(email: string, password: string) {
    console.log(email, password);
  }

  async function logout() {
    router.push('/login');
  }

  const accessibleValues: AuthContextProps = {
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={accessibleValues}>
      {pathName !== '/login' || false ? <AuthLoading text="Loading..." /> : children}
    </AuthContext.Provider>
  );
}


