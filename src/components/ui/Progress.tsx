import React from 'react';
import * as RadixProgress from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export function Progress({ value, className, barClassName }: ProgressProps) {
  return (
    <RadixProgress.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
      value={value}
    >
      <RadixProgress.Indicator
        className={cn('h-full bg-[#3B6FE8] transition-all duration-500 ease-out rounded-full', barClassName)}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </RadixProgress.Root>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({ value, size = 96, strokeWidth = 8, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E7ED"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3B6FE8"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-[#111827]">{value}%</span>
        <span className="text-xs text-[#6B7280]">done</span>
      </div>
    </div>
  );
}
