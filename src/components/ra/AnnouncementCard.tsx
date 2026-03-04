import React from 'react';
import { Pin, Calendar } from 'lucide-react';
import type { Announcement } from '../../types';
import { formatDate } from '../../lib/dateUtils';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <div className={cn(
      'rounded-xl border p-4 bg-white',
      announcement.isPinned ? 'border-[#3B6FE8] bg-[#EEF2FD]/30' : 'border-[#E4E7ED]'
    )}>
      <div className="flex items-start gap-2 mb-2">
        {announcement.isPinned && <Pin size={14} className="text-[#3B6FE8] flex-shrink-0 mt-0.5" />}
        <div className="flex-1">
          <h3 className="font-semibold text-[#111827] text-sm">{announcement.title}</h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-[#6B7280]">by {announcement.authorName}</span>
            <span className="text-xs text-[#6B7280] flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(announcement.createdAt)}
            </span>
            {announcement.dormBuilding !== 'all' && (
              <Badge variant="primary">{announcement.dormBuilding}</Badge>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-[#6B7280] leading-relaxed">{announcement.body}</p>
    </div>
  );
}
