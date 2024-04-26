import type { Metadata } from 'next';
import { ReactNode } from 'react';
import AppBar from '../components/AppBar';

export const metadata: Metadata = {
  title: '11CMOD - login',
  description: '',
};

export default function LoginLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-full w-full relative">
      <AppBar />
      <div className="w-full flex" style={{ height: 'calc(100vh - 64px)' }}>
        {children}
      </div>
    </div>
  );
}
