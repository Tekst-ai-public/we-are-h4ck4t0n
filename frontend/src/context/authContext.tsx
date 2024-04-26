'use client';

import { AuthLoading } from '@/app/(auth)/components/AuthLoading';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

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
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  async function login(email: string, password: string) {
    
  }

  async function logout() {
    router.push('/login');
    await ...
  }

  

  const accessibleValues: AuthContextProps = {

    login,
    logout,
  };

  return (
    <AuthContext.Provider value={accessibleValues}>
      {pathName !== '/login' && !auth.currentUser ? <AuthLoading text="Loading..." /> : children}
    </AuthContext.Provider>
  );
}


