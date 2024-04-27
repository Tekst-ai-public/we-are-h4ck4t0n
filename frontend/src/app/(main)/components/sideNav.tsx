'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BarChart4Icon, ChevronLeft, ChevronRight, Settings2, Sigma, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const routes = [
  { route: '/dashboard', text: 'Dashboard', logo: () => <BarChart4Icon /> },
  { route: '/ai', text: 'Models', logo: () => <Sparkles /> },
  { route: '/analytics', text: 'Analytics', logo: () => <Sigma /> },
  { route: '/settings', text: 'Settings', logo: () => <Settings2 />, align: 'end' },
];

export default function SideNav() {
  const [collapse, setCollapse] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-white sm:flex ',
        collapse ? 'w-14' : 'w-60'
      )}
    >
      <nav className="flex flex-col items-center gap-4 px-2 pt-3">
        <div className="relative bg-white rounded-full h-11 w-11">
          <Image
            src="/logo.svg"
            width={30}
            height={0}
            alt="logo"
            className="h-auto absolute-center ml-[2px]"
          />
        </div>
        {routes
          .filter((route) => route.align !== 'end')
          .map((route, index) => (
            <Link href={route.route} key={index} className="flex-center w-full">
              {collapse ? (
                <Button
                  variant={pathname.includes(route.route) ? 'outline' : 'ghost'}
                  className="p-0 h-10 w-10"
                >
                  {route.logo()}
                </Button>
              ) : (
                <Button
                  variant={pathname.includes(route.route) ? 'outline' : 'ghost'}
                  className="gap-2 w-full"
                >
                  {route.logo()}
                  {route.text}
                </Button>
              )}
            </Link>
          ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {routes
          .filter((route) => route.align === 'end')
          .map((route, index) => (
            <Link href={route.route} key={index} className="flex-center w-full cursor-pointer">
              {collapse ? (
                <Button
                  variant={pathname.includes(route.route) ? 'outline' : 'ghost'}
                  className="p-0 h-10 w-10"
                >
                  {route.logo()}
                </Button>
              ) : (
                <Button
                  variant={pathname.includes(route.route) ? 'outline' : 'ghost'}
                  className="gap-2 w-full"
                >
                  {route.logo()}
                  {route.text}
                </Button>
              )}
            </Link>
          ))}
      </nav>
      <div className="ml-auto ">
        <Button variant="ghost" className="w-8 h-8 p-0 mr-3 mb-2" onClick={() => setCollapse(!collapse)}>
          {collapse ? <ChevronRight className="shrink-0" /> : <ChevronLeft className="shrink-0" />}
        </Button>
      </div>
    </aside>
  );
}
