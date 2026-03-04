import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-all',
                isCompleted ? 'bg-[#3B6FE8] border-[#3B6FE8] text-white' :
                isActive ? 'border-[#3B6FE8] text-[#3B6FE8]' :
                'border-[#E4E7ED] text-[#6B7280]'
              )}>
                {isCompleted ? <Check size={14} /> : stepNum}
              </div>
              {labels && <span className="text-xs text-[#6B7280] hidden sm:block">{labels[i]}</span>}
            </div>
            {i < totalSteps - 1 && (
              <div className={cn('h-0.5 flex-1 mx-2 transition-colors', isCompleted ? 'bg-[#3B6FE8]' : 'bg-[#E4E7ED]')} style={{ minWidth: 24 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
