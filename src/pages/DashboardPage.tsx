import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, AlertCircle, ArrowRight, Megaphone, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useChecklist } from '../hooks/useChecklist';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChecklistItem } from '../components/checklist/ChecklistItem';
import { AnnouncementCard } from '../components/ra/AnnouncementCard';
import { getCountdown, formatDate, formatTime } from '../lib/dateUtils';
import { isWithin48Hours } from '../lib/dateUtils';

export default function DashboardPage() {
  const { currentUser, state } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/onboarding');
    return null;
  }

  const { tasks, progress, total, completed, urgentTasks, toggleStatus } = useChecklist(currentUser.id);
  const { pinned, announcements } = useAnnouncements();

  const timeSlot = currentUser.timeSlotId
    ? state.timeSlots.find((s) => s.id === currentUser.timeSlotId)
    : null;

  const nextTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 3);

  // Toast notifications for near-deadline tasks
  useEffect(() => {
    const nearDeadline = tasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && isWithin48Hours(t.dueDate)
    );
    if (nearDeadline.length > 0) {
      setTimeout(() => {
        nearDeadline.slice(0, 3).forEach((t, i) => {
          setTimeout(() => {
            toast(`⏰ Due soon: ${t.title}`, {
              duration: 4000,
              style: { background: '#FFF7ED', border: '1px solid #FED7AA', color: '#92400E' },
            });
          }, i * 800);
        });
      }, 1200);
    }
  }, []);

  return (
    <div>
      <PageHeader
        title={`Hey, ${currentUser.name.split(' ')[0]}! 👋`}
        subtitle={`${currentUser.dormBuilding} · Room ${currentUser.roomNumber}`}
      />

      {/* Countdown + Progress row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Countdown */}
        <Card className="sm:col-span-2">
          <CardContent className="flex items-center gap-4 py-5">
            <div className="w-12 h-12 bg-[#EEF2FD] rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar size={22} className="text-[#3B6FE8]" />
            </div>
            <div>
              <div className="text-xs text-[#6B7280] font-medium uppercase tracking-wide">Move-In Day</div>
              <div className="text-2xl font-semibold text-[#111827] mt-0.5">
                {getCountdown(currentUser.moveDate)}
              </div>
              <div className="text-sm text-[#6B7280]">{formatDate(currentUser.moveDate)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Progress ring */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-4">
            <ProgressRing value={progress} size={88} />
            <div className="text-xs text-[#6B7280] mt-2">{completed}/{total} tasks done</div>
          </CardContent>
        </Card>
      </div>

      {/* Time slot status */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-3 py-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${timeSlot ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Clock size={18} className={timeSlot ? 'text-green-600' : 'text-amber-600'} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-[#111827]">
              {timeSlot ? 'Time Slot Booked' : 'No Time Slot Booked'}
            </div>
            <div className="text-xs text-[#6B7280]">
              {timeSlot
                ? `${formatTime(timeSlot.startTime)} – ${formatTime(timeSlot.endTime)}`
                : 'Book your arrival time to avoid congestion'}
            </div>
          </div>
          {!timeSlot && (
            <Button size="sm" onClick={() => navigate('/timeslots')}>
              Book Now
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Urgent tasks */}
      {urgentTasks.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-600" />
              <span className="font-semibold text-sm text-red-700">Urgent Tasks</span>
              <Badge variant="danger">{urgentTasks.length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {urgentTasks.slice(0, 3).map((task) => (
                <ChecklistItem key={task.id} task={task} onToggle={toggleStatus} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next tasks */}
      {nextTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#111827]">Up Next</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/checklist')} className="gap-1 text-[#3B6FE8]">
              View all <ArrowRight size={14} />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {nextTasks.map((task) => (
              <ChecklistItem key={task.id} task={task} onToggle={toggleStatus} />
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={16} className="text-[#3B6FE8]" />
            <h2 className="font-semibold text-[#111827]">Announcements</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[...pinned, ...announcements.filter((a) => !a.isPinned)].slice(0, 2).map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
