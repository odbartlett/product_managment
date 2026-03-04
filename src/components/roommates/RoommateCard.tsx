import React from 'react';
import { User as UserIcon, Calendar, Clock } from 'lucide-react';
import type { User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime } from '../../lib/dateUtils';
import { useAppContext } from '../../context/AppContext';

interface RoommateCardProps {
  user: User;
}

export function RoommateCard({ user }: RoommateCardProps) {
  const { state } = useAppContext();
  const timeSlot = user.timeSlotId
    ? state.timeSlots.find((s) => s.id === user.timeSlotId)
    : null;

  return (
    <div className="bg-white rounded-xl border border-[#E4E7ED] p-4 flex items-start gap-4">
      <Avatar initials={user.avatarInitials} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-[#111827]">{user.name}</h3>
          <Badge variant="primary">Roommate</Badge>
        </div>
        <p className="text-xs text-[#6B7280] mt-0.5">{user.email}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <Calendar size={12} />
            <span>{formatDate(user.moveDate)}</span>
          </div>
          {timeSlot && (
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <Clock size={12} />
              <span>{formatTime(timeSlot.startTime)} – {formatTime(timeSlot.endTime)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
