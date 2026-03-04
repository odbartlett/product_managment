import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { PageHeader } from '../components/layout/PageHeader';
import { SlotCard } from '../components/timeslots/SlotCard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../lib/dateUtils';
import { Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TimeSlotsPage() {
  const { currentUser } = useAppContext();
  const { slots, currentSlotId, bookSlot, unbookSlot } = useTimeSlots();

  if (!currentUser) return null;

  const handleBook = (slotId: string) => {
    bookSlot(slotId);
    toast.success('Time slot booked! See you on move-in day.', { icon: '🗓️' });
  };

  const handleUnbook = (slotId: string) => {
    unbookSlot();
    toast('Booking cancelled.', { icon: '📅' });
  };

  const moveDate = slots[0]?.date ?? currentUser.moveDate.slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Time Slots"
        subtitle={`Choose your arrival window for ${formatDate(moveDate)}`}
      />

      {/* Info banner */}
      <Card className="mb-6 border-blue-200 bg-[#EEF2FD]">
        <CardContent className="flex gap-3 items-start py-4">
          <Info size={18} className="text-[#3B6FE8] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#3B6FE8]">Why book a time slot?</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Staggered arrivals reduce elevator congestion and ensure access to dollies and carts.
              The 2:00 PM slot is already full — pick an earlier time!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current booking status */}
      {currentSlotId && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="py-3 flex items-center gap-3">
            <span className="text-lg">✅</span>
            <div>
              <p className="text-sm font-medium text-green-800">You have a slot booked</p>
              <p className="text-xs text-green-600">You can change it by selecting a different slot below.</p>
            </div>
            <Badge variant="success" className="ml-auto">Confirmed</Badge>
          </CardContent>
        </Card>
      )}

      {/* Slot grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            isBooked={slot.id === currentSlotId}
            onBook={handleBook}
            onUnbook={handleUnbook}
          />
        ))}
        {slots.length === 0 && (
          <div className="col-span-2 text-center py-12 text-[#6B7280]">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium">No time slots available</p>
            <p className="text-sm mt-1">Contact your RA for assistance.</p>
          </div>
        )}
      </div>
    </div>
  );
}
