import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimelineStepProps {
  step: number;
  title: string;
  description: string;
  time?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
  isLast?: boolean;
}

export function TimelineStep({ step, title, description, time, isCompleted, isCurrent, isLast }: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors',
          isCompleted
            ? 'bg-[#3B6FE8] border-[#3B6FE8] text-white'
            : isCurrent
            ? 'border-[#3B6FE8] text-[#3B6FE8] bg-[#EEF2FD]'
            : 'border-[#E4E7ED] text-[#6B7280] bg-white'
        )}>
          {isCompleted ? <Check size={16} /> : <span className="text-sm font-semibold">{step}</span>}
        </div>
        {!isLast && <div className={cn('w-0.5 flex-1 mt-1', isCompleted ? 'bg-[#3B6FE8]' : 'bg-[#E4E7ED]')} style={{ minHeight: '32px' }} />}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={cn('font-semibold text-sm', isCurrent ? 'text-[#3B6FE8]' : 'text-[#111827]')}>{title}</h3>
          {time && <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">{time}</span>}
        </div>
        <p className="text-sm text-[#6B7280] mt-1">{description}</p>
      </div>
    </div>
  );
}
