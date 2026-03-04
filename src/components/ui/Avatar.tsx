import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../../lib/utils';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const colorPalette = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
];

function getColor(initials: string): string {
  const idx = initials.charCodeAt(0) % colorPalette.length;
  return colorPalette[idx];
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  const bgColor = getColor(initials);
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white select-none',
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      <RadixAvatar.Fallback>{initials}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
