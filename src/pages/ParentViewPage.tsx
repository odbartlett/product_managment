import React from 'react';
import { Eye, Calendar, Clock, Home } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useChecklist } from '../hooks/useChecklist';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/Progress';
import { ChecklistGroup } from '../components/checklist/ChecklistGroup';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { getCountdown, formatDate, formatTime } from '../lib/dateUtils';
import type { TaskCategory } from '../types';

export default function ParentViewPage() {
  const { currentUser, state } = useAppContext();

  if (!currentUser) return null;

  // If parent, find linked student
  const student = currentUser.role === 'parent' && currentUser.linkedStudentId
    ? state.users.find((u) => u.id === currentUser.linkedStudentId) ?? null
    : currentUser.role === 'student' ? currentUser : null;

  if (!student) {
    return (
      <div className="text-center py-16">
        <Eye size={40} className="mx-auto mb-3 text-gray-300" />
        <h2 className="text-xl font-semibold text-[#111827] mb-2">No student linked</h2>
        <p className="text-[#6B7280] max-w-sm mx-auto">
          Ask your student for their access code and enter it during onboarding to view their progress.
        </p>
      </div>
    );
  }

  const { byCategory, total, completed, progress } = useChecklist(student.id);
  const timeSlot = student.timeSlotId
    ? state.timeSlots.find((s) => s.id === student.timeSlotId)
    : null;

  return (
    <div>
      <PageHeader
        title="Student View"
        subtitle="Read-only view of your student's move-in progress"
      />

      {/* Read-only notice */}
      <Card className="mb-6 border-amber-300 bg-amber-50">
        <CardContent className="flex gap-2 items-center py-3">
          <Eye size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Read-only view — you can monitor but not edit your student's tasks.
          </p>
        </CardContent>
      </Card>

      {/* Student card */}
      <Card className="mb-6">
        <CardContent className="flex gap-4 items-center py-4">
          <Avatar initials={student.avatarInitials} size="lg" />
          <div className="flex-1">
            <h2 className="font-semibold text-[#111827]">{student.name}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-[#6B7280]">
              <span className="flex items-center gap-1"><Home size={11} />{student.dormBuilding} · Room {student.roomNumber}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(student.moveDate)}</span>
              {timeSlot && (
                <span className="flex items-center gap-1"><Clock size={11} />{formatTime(timeSlot.startTime)}–{formatTime(timeSlot.endTime)}</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <ProgressRing value={progress} size={72} strokeWidth={6} />
          </div>
        </CardContent>
      </Card>

      {/* Countdown + stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Countdown', value: getCountdown(student.moveDate), small: true },
          { label: 'Tasks Done', value: `${completed}/${total}` },
          { label: 'Progress', value: `${progress}%` },
          { label: 'Slot', value: timeSlot ? '✓ Booked' : '✗ None' },
        ].map(({ label, value, small }) => (
          <Card key={label}>
            <CardContent className="py-3 text-center">
              <div className={`font-bold text-[#111827] ${small ? 'text-sm' : 'text-xl'}`}>{value}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Read-only checklist */}
      <div>
        <h2 className="font-semibold text-[#111827] mb-3">Task Progress</h2>
        <div className="flex flex-col gap-4">
          {Object.entries(byCategory).map(([category, tasks]) => (
            <ChecklistGroup
              key={category}
              category={category as TaskCategory}
              tasks={tasks}
              onToggle={() => {}}
              readOnly
              defaultOpen
            />
          ))}
        </div>
      </div>
    </div>
  );
}
