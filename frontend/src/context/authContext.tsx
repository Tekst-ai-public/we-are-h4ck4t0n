'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AuthLoading } from '@/app/(auth)/components/AuthLoading';

interface FetchResponse<T> extends Response {
  json: () => Promise<T>;
}

interface AuthContextProps {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: <T>(path: string, init: RequestInit | undefined) => Promise<FetchResponse<T>>
}

const AuthContext = createContext<AuthContextProps>({
  login: async () => {
    throw new Error('Login function not implemented');
  },
  logout: async () => {
    throw new Error('Logout function not implemented');
  },
  apiFetch: async () => {
    throw new Error("Api fetch not implemented")
  }
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()

  useEffect(() => {
    apiFetch("/me").then(async res => {
      if (!res.ok) {
        window.location.href = process.env.NEXT_PUBLIC_API_BASE_URL + "/login"
        return
      }
      const data = await res.json()
      setUser(data)
      setLoading(false)
    })
  }, [])

  async function apiFetch<T = any>(path: string, init: RequestInit | undefined = {}): Promise<FetchResponse<T>> {
    init.headers = {
      'Content-Type': 'application/json',
      ...init.headers,
    };
    const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL + path);
    return fetch(`${url.toString()}`, {
      ...init,
      credentials: "include"
    });
  }

  async function login(email: string, password: string) {
    console.log(email, password);
  }

  async function logout() {
    const response = await apiFetch("/logout");
    if (response.ok) {
      // Redirect using client-side routing, assuming you are using Next.js or React Router
      router.push('/dashboard'); // or history.push('/login') in React Router
      const response = await apiFetch("/login");
    } else {
      console.error('Failed to log out');
    }
  }

  const accessibleValues: AuthContextProps = {
    login,
    logout,
    apiFetch
  };

  return (
    <AuthContext.Provider value={accessibleValues}>
      {loading || !user ? <AuthLoading text="Loading..." /> : children}
    </AuthContext.Provider>
  );
}


