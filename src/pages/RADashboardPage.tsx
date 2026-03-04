import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Shield, Users, Megaphone, BarChart3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useChecklist } from '../hooks/useChecklist';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { AnnouncementCard } from '../components/ra/AnnouncementCard';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { Progress } from '../components/ui/Progress';
import { formatTime } from '../lib/dateUtils';
import { cn } from '../lib/utils';
import type { User } from '../types';

function StudentOverviewRow({ student }: { student: User }) {
  const { total, completed, progress } = useChecklist(student.id);
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center gap-3 mb-2">
          <Avatar initials={student.avatarInitials} size="sm" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111827]">{student.name}</span>
              <span className="text-xs text-[#6B7280]">{completed}/{total}</span>
            </div>
            <Progress value={progress} className="mt-1 h-1.5" />
          </div>
          <span className="text-sm font-semibold text-[#3B6FE8]">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RADashboardPage() {
  const { currentUser, state } = useAppContext();
  const { announcements, postAnnouncement } = useAnnouncements();
  const [postOpen, setPostOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annPin, setAnnPin] = useState(false);
  const [annScope, setAnnScope] = useState<'all' | string>('all');

  if (!currentUser || currentUser.role !== 'ra') {
    return (
      <div className="text-center py-16 text-[#6B7280]">
        <Shield size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="font-medium">RA access required</p>
      </div>
    );
  }

  // Students in same building
  const floorStudents = state.users.filter(
    (u) => u.role === 'student' && u.dormBuilding === currentUser.dormBuilding
  );

  const handlePost = () => {
    if (!annTitle || !annBody) return;
    postAnnouncement({
      dormBuilding: annScope,
      title: annTitle,
      body: annBody,
      isPinned: annPin,
    });
    setAnnTitle('');
    setAnnBody('');
    setAnnPin(false);
    setPostOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="RA Dashboard"
        subtitle={`${currentUser.dormBuilding} · ${currentUser.university}`}
        action={
          <Button onClick={() => setPostOpen(true)} size="sm">
            Post Announcement
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Students', value: floorStudents.length, icon: '🎒' },
          { label: 'Slots Booked', value: floorStudents.filter((u) => u.timeSlotId).length, icon: '📅' },
          { label: 'Announcements', value: announcements.length, icon: '📢' },
        ].map(({ label, value, icon }) => (
          <Card key={label}>
            <CardContent className="text-center py-4">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-[#111827]">{value}</div>
              <div className="text-xs text-[#6B7280]">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs.Root defaultValue="arrivals">
        <Tabs.List className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { value: 'arrivals', label: 'Arrivals', icon: Users },
            { value: 'announcements', label: 'Announcements', icon: Megaphone },
            { value: 'overview', label: 'Overview', icon: BarChart3 },
          ].map(({ value, label, icon: Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                'data-[state=active]:bg-white data-[state=active]:text-[#3B6FE8] data-[state=active]:shadow-sm',
                'data-[state=inactive]:text-[#6B7280] data-[state=inactive]:hover:text-[#111827]'
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Arrivals Tab */}
        <Tabs.Content value="arrivals">
          <div className="flex flex-col gap-3">
            {floorStudents.map((student) => {
              const slot = student.timeSlotId
                ? state.timeSlots.find((s) => s.id === student.timeSlotId)
                : null;
              return (
                <Card key={student.id}>
                  <CardContent className="flex items-center gap-3 py-3">
                    <Avatar initials={student.avatarInitials} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#111827]">{student.name}</div>
                      <div className="text-xs text-[#6B7280]">Room {student.roomNumber}</div>
                    </div>
                    <div className="text-right">
                      {slot ? (
                        <>
                          <Badge variant="success">Slot Booked</Badge>
                          <div className="text-xs text-[#6B7280] mt-1">
                            {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                          </div>
                        </>
                      ) : (
                        <Badge variant="warning">No Slot</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {floorStudents.length === 0 && (
              <div className="text-center py-8 text-[#6B7280]">
                <p>No students assigned to {currentUser.dormBuilding} yet.</p>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* Announcements Tab */}
        <Tabs.Content value="announcements">
          <div className="flex flex-col gap-3">
            {announcements.length === 0 && (
              <div className="text-center py-8 text-[#6B7280]">
                <Megaphone size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No announcements posted yet.</p>
              </div>
            )}
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </Tabs.Content>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <div className="flex flex-col gap-4">
            {floorStudents.map((student) => (
              <StudentOverviewRow key={student.id} student={student} />
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Post Announcement Modal */}
      <Modal
        open={postOpen}
        onOpenChange={setPostOpen}
        title="Post Announcement"
        description="Broadcast a message to students in your building"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            placeholder="Welcome message, reminders..."
            value={annTitle}
            onChange={(e) => setAnnTitle(e.target.value)}
          />
          <Textarea
            label="Message"
            placeholder="Write your announcement here..."
            rows={4}
            value={annBody}
            onChange={(e) => setAnnBody(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-[#111827] block mb-1">Scope</label>
            <div className="flex gap-2">
              {(['all', currentUser.dormBuilding] as const).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setAnnScope(scope)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                    annScope === scope
                      ? 'border-[#3B6FE8] bg-[#EEF2FD] text-[#3B6FE8]'
                      : 'border-[#E4E7ED] text-[#6B7280]'
                  )}
                >
                  {scope === 'all' ? 'All Buildings' : scope}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin"
              checked={annPin}
              onChange={(e) => setAnnPin(e.target.checked)}
              className="w-4 h-4 accent-[#3B6FE8]"
            />
            <label htmlFor="pin" className="text-sm text-[#111827]">Pin this announcement</label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setPostOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handlePost} disabled={!annTitle || !annBody}>Post</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
