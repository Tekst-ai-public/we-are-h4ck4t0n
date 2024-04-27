import React from 'react';
import { cn } from '@/lib/utils';

type PingProps = {
  className?: string;
  pingColor?: string;
  dotColor?: string;
};

export default function Ping({ className, pingColor, dotColor }: PingProps) {
  return (
    <span className={cn('absolute -top-2 -right-2 flex h-5 w-5 rounded-full flex-center', className)}>
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          pingColor ?? 'bg-secondary'
        )}
      />
      <span className={cn('relative inline-flex rounded-full h-3 w-3', dotColor ?? 'bg-secondary')} />
    </span>
  );
}
