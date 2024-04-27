import React from 'react';
import { cn } from '@/lib/utils';

type PingProps = {
  className?: string;
  pingColor?: string;
  dotColor?: string;
};

export default function Ping({ className, pingColor, dotColor }: PingProps) {
  return (
    <span className={cn('absolute -top-1 -right-1 flex h-3 w-3', className)}>
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
