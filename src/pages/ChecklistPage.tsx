import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useChecklist } from '../hooks/useChecklist';
import { PageHeader } from '../components/layout/PageHeader';
import { ChecklistGroup } from '../components/checklist/ChecklistGroup';
import { Progress } from '../components/ui/Progress';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { TaskCategory, TaskStatus } from '../types';
import { cn } from '../lib/utils';

const STATUS_FILTERS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Done' },
];

export default function ChecklistPage() {
  const { currentUser } = useAppContext();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  if (!currentUser) return null;

  const { tasks, byCategory, progress, total, completed, toggleStatus } = useChecklist(currentUser.id);

  const filteredByCategory = Object.entries(byCategory).reduce<Record<string, typeof tasks>>(
    (acc, [cat, catTasks]) => {
      const filtered = statusFilter === 'all'
        ? catTasks
        : catTasks.filter((t) => t.status === statusFilter);
      if (filtered.length > 0) acc[cat] = filtered;
      return acc;
    },
    {}
  );

  return (
    <div>
      <PageHeader
        title="Checklist"
        subtitle="Track everything you need to do before move-in day"
      />

      {/* Progress summary */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#111827]">Overall Progress</span>
            <span className="text-sm font-semibold text-[#3B6FE8]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2.5" />
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-[#6B7280]">{completed} of {total} tasks complete</span>
            <Badge variant="success">{completed} done</Badge>
            <Badge variant="warning">{total - completed} remaining</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <Filter size={14} className="text-[#6B7280] flex-shrink-0" />
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              statusFilter === value
                ? 'bg-[#3B6FE8] text-white'
                : 'bg-white border border-[#E4E7ED] text-[#6B7280] hover:border-[#3B6FE8]/40'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grouped tasks */}
      <div className="flex flex-col gap-4">
        {Object.entries(filteredByCategory).map(([category, catTasks]) => (
          <ChecklistGroup
            key={category}
            category={category as TaskCategory}
            tasks={[...catTasks].sort((a, b) => a.sortOrder - b.sortOrder)}
            onToggle={toggleStatus}
            defaultOpen
          />
        ))}
        {Object.keys(filteredByCategory).length === 0 && (
          <div className="text-center py-12 text-[#6B7280]">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-medium">No tasks match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
