import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { Toaster } from 'sonner';
import { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '11CMOD - Content Moderation',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
