import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ChecklistTask, TaskCategory } from '../../types';
import { ChecklistItem } from './ChecklistItem';
import { Progress } from '../ui/Progress';
import { cn } from '../../lib/utils';

const categoryLabels: Record<TaskCategory, string> = {
  housing: 'Housing',
  academic: 'Academic',
  utilities: 'Utilities',
  packing: 'Packing',
  paperwork: 'Paperwork',
  social: 'Social',
  financial: 'Financial',
};

interface ChecklistGroupProps {
  category: TaskCategory;
  tasks: ChecklistTask[];
  onToggle: (task: ChecklistTask) => void;
  readOnly?: boolean;
  defaultOpen?: boolean;
}

export function ChecklistGroup({ category, tasks, onToggle, readOnly = false, defaultOpen = true }: ChecklistGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="border border-[#E4E7ED] rounded-xl overflow-hidden bg-white">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown size={16} className="text-[#6B7280]" /> : <ChevronRight size={16} className="text-[#6B7280]" />}
        <span className="font-medium text-[#111827] flex-1">{categoryLabels[category]}</span>
        <span className="text-sm text-[#6B7280]">{completed}/{tasks.length}</span>
      </button>
      {open && (
        <div className="border-t border-[#E4E7ED]">
          <div className="px-4 py-2">
            <Progress value={progress} />
          </div>
          <div className="p-3 flex flex-col gap-2">
            {tasks.map((task) => (
              <ChecklistItem key={task.id} task={task} onToggle={onToggle} readOnly={readOnly} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
