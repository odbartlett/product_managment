import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, ChevronRight } from 'lucide-react';
import type { ChecklistTask } from '../../types';
import { Badge } from '../ui/Badge';
import { DeadlineBadge } from './DeadlineBadge';
import { cn } from '../../lib/utils';

const priorityVariants: Record<string, 'default' | 'warning' | 'danger' | 'urgent'> = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
  urgent: 'urgent',
};

const categoryColors: Record<string, string> = {
  housing: 'bg-blue-100 text-blue-700',
  academic: 'bg-purple-100 text-purple-700',
  utilities: 'bg-cyan-100 text-cyan-700',
  packing: 'bg-amber-100 text-amber-700',
  paperwork: 'bg-rose-100 text-rose-700',
  social: 'bg-green-100 text-green-700',
  financial: 'bg-emerald-100 text-emerald-700',
};

interface ChecklistItemProps {
  task: ChecklistTask;
  onToggle: (task: ChecklistTask) => void;
  readOnly?: boolean;
}

export function ChecklistItem({ task, onToggle, readOnly = false }: ChecklistItemProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border transition-all duration-150',
        isCompleted
          ? 'bg-gray-50 border-gray-200 opacity-70'
          : 'bg-white border-[#E4E7ED] hover:border-[#3B6FE8]/30 hover:shadow-sm'
      )}
    >
      {!readOnly && (
        <Checkbox.Root
          checked={isCompleted}
          onCheckedChange={() => onToggle(task)}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded border-2 transition-colors duration-150 mt-0.5',
            isCompleted
              ? 'bg-[#3B6FE8] border-[#3B6FE8]'
              : 'border-[#E4E7ED] hover:border-[#3B6FE8]'
          )}
        >
          <Checkbox.Indicator className="flex items-center justify-center">
            <Check size={12} className="text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium', isCompleted && 'line-through text-[#6B7280]')}>
            {task.title}
          </p>
          <Badge variant={priorityVariants[task.priority]} className="flex-shrink-0 text-xs">
            {task.priority}
          </Badge>
        </div>
        <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{task.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', categoryColors[task.category])}>
            {task.category}
          </span>
          <DeadlineBadge dueDate={task.dueDate} />
          {task.isRequired && (
            <span className="text-xs text-[#6B7280]">Required</span>
          )}
        </div>
      </div>
    </div>
  );
}
