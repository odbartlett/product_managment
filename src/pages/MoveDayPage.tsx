import React from 'react';
import { Truck, Clock, Wrench } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { TimelineStep } from '../components/moveday/TimelineStep';
import { Card, CardContent } from '../components/ui/Card';
import { formatTime, formatDate } from '../lib/dateUtils';

const MOVE_IN_STEPS = [
  {
    title: 'Arrive & Check In',
    description: 'Go to the main housing desk with your ID and confirmation email. Pick up your room key and welcome packet.',
    time: '~15 min',
  },
  {
    title: 'Grab a Trolley or Cart',
    description: 'Pick up a dolly or rolling cart from the building entrance. Limit one per party — return it when done!',
    time: '~5 min',
  },
  {
    title: 'Load the Elevator',
    description: 'Use the designated move-in elevator (usually service elevator). Max load per trip is guided by the RA on duty.',
    time: 'As needed',
  },
  {
    title: 'Unload & Set Up Room',
    description: 'Bring boxes and furniture to your room. Check for any pre-existing damage and photograph it before reporting.',
    time: '1–3 hours',
  },
  {
    title: 'Complete Move-In Inspection',
    description: 'Walk through the room with your RA. Sign the condition report — your deposit depends on it!',
    time: '~20 min',
  },
  {
    title: 'Return Equipment',
    description: 'Return the trolley/cart/dolly to the building entrance so other students can use it.',
    time: '~5 min',
  },
  {
    title: 'Get Connected',
    description: 'Log on to campus WiFi, register your devices at the IT desk, and set up your room the way you want it.',
    time: '~30 min',
  },
  {
    title: 'Meet Your RA',
    description: 'Attend the floor meeting (time will be posted). Great time to meet neighbors and learn about building rules.',
    time: 'Evening',
  },
];

export default function MoveDayPage() {
  const { currentUser, state } = useAppContext();

  if (!currentUser) return null;

  const timeSlot = currentUser.timeSlotId
    ? state.timeSlots.find((s) => s.id === currentUser.timeSlotId)
    : null;

  const resources = state.resources.filter(
    (r) => r.dormBuilding === currentUser.dormBuilding
  );

  return (
    <div>
      <PageHeader
        title="Move Day"
        subtitle="Your step-by-step guide for a smooth move-in"
      />

      {/* Time slot reminder */}
      {timeSlot ? (
        <Card className="mb-6 border-[#3B6FE8] bg-[#EEF2FD]">
          <CardContent className="flex gap-3 items-center py-4">
            <div className="w-10 h-10 bg-[#3B6FE8] rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#3B6FE8]">Your Arrival Window</p>
              <p className="text-lg font-bold text-[#111827]">
                {formatTime(timeSlot.startTime)} – {formatTime(timeSlot.endTime)}
              </p>
              <p className="text-xs text-[#6B7280]">{formatDate(timeSlot.date)} · {timeSlot.dormBuilding}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-amber-300 bg-amber-50">
          <CardContent className="flex gap-3 items-center py-4">
            <Clock size={20} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              You haven't booked a time slot yet.{' '}
              <a href="/timeslots" className="underline font-medium">Book one now</a>.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resource widget */}
      {resources.length > 0 && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={16} className="text-[#3B6FE8]" />
              <span className="font-semibold text-sm text-[#111827]">Equipment Availability — {currentUser.dormBuilding}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {resources.map((r) => {
                const pct = r.totalCount > 0 ? r.availableCount / r.totalCount : 0;
                return (
                  <div key={r.id} className="text-center">
                    <div className="text-lg font-bold text-[#111827]">{r.availableCount}</div>
                    <div className="text-xs text-[#6B7280] capitalize">{r.type}s</div>
                    <div className={`text-xs font-medium mt-0.5 ${pct === 0 ? 'text-red-600' : pct < 0.5 ? 'text-amber-600' : 'text-green-600'}`}>
                      {pct === 0 ? 'None left' : `${r.availableCount}/${r.totalCount} free`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-[#3B6FE8]" />
          <h2 className="font-semibold text-[#111827]">Move-In Steps</h2>
        </div>
        <div className="bg-white rounded-xl border border-[#E4E7ED] p-4">
          {MOVE_IN_STEPS.map((step, i) => (
            <TimelineStep
              key={i}
              step={i + 1}
              title={step.title}
              description={step.description}
              time={step.time}
              isCompleted={false}
              isCurrent={i === 0}
              isLast={i === MOVE_IN_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
