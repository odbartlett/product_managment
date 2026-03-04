import React from 'react';
import { Clock, Users, Check } from 'lucide-react';
import type { TimeSlot } from '../../types';
import { Button } from '../ui/Button';
import { formatTime } from '../../lib/dateUtils';
import { cn } from '../../lib/utils';

interface SlotCardProps {
  slot: TimeSlot;
  isBooked: boolean;
  onBook: (slotId: string) => void;
  onUnbook: (slotId: string) => void;
}

export function SlotCard({ slot, isBooked, onBook, onUnbook }: SlotCardProps) {
  const isFull = slot.bookedCount >= slot.capacity;
  const fillPercent = Math.round((slot.bookedCount / slot.capacity) * 100);

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-150',
        isBooked
          ? 'border-[#3B6FE8] bg-[#EEF2FD] shadow-md'
          : isFull
          ? 'border-red-200 bg-red-50 opacity-75'
          : 'border-[#E4E7ED] bg-white hover:border-[#3B6FE8]/40 hover:shadow-sm'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={16} className={isBooked ? 'text-[#3B6FE8]' : 'text-[#6B7280]'} />
            <span className="font-semibold text-[#111827] text-sm">
              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Users size={13} className="text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">
              {slot.bookedCount} / {slot.capacity} booked
            </span>
            {isFull && (
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">FULL</span>
            )}
          </div>
        </div>
        {isBooked && (
          <div className="flex items-center gap-1 text-[#3B6FE8] text-xs font-medium bg-white rounded-lg px-2 py-1">
            <Check size={13} />
            Booked
          </div>
        )}
      </div>

      {/* Capacity bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 mb-3">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            fillPercent >= 100 ? 'bg-red-500' : fillPercent >= 75 ? 'bg-amber-500' : 'bg-[#3B6FE8]'
          )}
          style={{ width: `${Math.min(fillPercent, 100)}%` }}
        />
      </div>

      {isBooked ? (
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onUnbook(slot.id)}>
          Cancel Booking
        </Button>
      ) : (
        <Button
          variant={isFull ? 'secondary' : 'primary'}
          size="sm"
          className="w-full"
          disabled={isFull}
          onClick={() => onBook(slot.id)}
        >
          {isFull ? 'Slot Full' : 'Book This Slot'}
        </Button>
      )}
    </div>
  );
}
