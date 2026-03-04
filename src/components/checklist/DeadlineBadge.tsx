import React from 'react';
import { Clock } from 'lucide-react';
import { getDeadlineBgColor } from '../../lib/dateUtils';
import { formatDate } from '../../lib/dateUtils';
import { cn } from '../../lib/utils';

interface DeadlineBadgeProps {
  dueDate: string | null;
}

export function DeadlineBadge({ dueDate }: DeadlineBadgeProps) {
  if (!dueDate) return null;
  const colorClass = getDeadlineBgColor(dueDate);
  const isPast = new Date(dueDate) < new Date();

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', colorClass)}>
      <Clock size={10} />
      {isPast ? 'Overdue' : formatDate(dueDate)}
    </span>
  );
}
