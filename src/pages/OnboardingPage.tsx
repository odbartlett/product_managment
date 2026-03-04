import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ChevronLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { StepIndicator } from '../components/onboarding/StepIndicator';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { UNIVERSITIES, DORM_BUILDINGS } from '../constants/universities';
import { generateTasksForUser } from '../constants/checklist';
import type { User, ChecklistTask } from '../types';

const STEP_LABELS = ['Role', 'Profile', 'Residence', 'Review'];

interface FormData {
  role: 'student' | 'parent' | 'ra';
  name: string;
  email: string;
  university: string;
  dormBuilding: string;
  roomNumber: string;
  moveDate: string;
  moveType: 'move-in' | 'move-out';
  parentAccessCode: string;
}

const defaultForm: FormData = {
  role: 'student',
  name: '',
  email: '',
  university: 'State University',
  dormBuilding: 'Maple Hall',
  roomNumber: '',
  moveDate: '2026-08-20',
  moveType: 'move-in',
  parentAccessCode: '',
};

export default function OnboardingPage() {
  const { dispatch, state } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(defaultForm);

  const set = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const dormOptions = (DORM_BUILDINGS[form.university] ?? []).map((b) => ({ value: b, label: b }));
  const uniOptions = UNIVERSITIES.map((u) => ({ value: u, label: u }));

  const handleComplete = () => {
    let linkedStudentId: string | null = null;

    if (form.role === 'parent' && form.parentAccessCode) {
      const student = state.users.find(
        (u) => u.parentAccessCode === form.parentAccessCode && u.role === 'student'
      );
      if (student) linkedStudentId = student.id;
    }

    const initials = form.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: User = {
      id: uuidv4(),
      name: form.name || 'New Student',
      email: form.email || 'student@university.edu',
      role: form.role,
      university: form.university,
      dormBuilding: form.dormBuilding,
      roomNumber: form.roomNumber || '100',
      moveDate: new Date(form.moveDate).toISOString(),
      moveType: form.moveType,
      timeSlotId: null,
      roommateIds: [],
      parentAccessCode: form.role === 'student' ? `${(form.name || 'USER').toUpperCase().replace(/\s/g, '-')}-2024` : null,
      linkedStudentId,
      avatarInitials: initials || 'U',
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_USER', payload: newUser });

    // Seed tasks for students/RAs
    if (form.role === 'student' || form.role === 'ra') {
      const taskTemplates = generateTasksForUser(newUser.id, form.moveType, newUser.moveDate);
      taskTemplates.forEach((t) => {
        dispatch({ type: 'ADD_TASK', payload: { ...t, id: uuidv4() } as ChecklistTask });
      });
    }

    dispatch({ type: 'SET_ACTIVE_USER', payload: newUser.id });
    dispatch({ type: 'SET_SESSION', payload: { hasCompletedOnboarding: true } });

    const dest = form.role === 'parent' ? '/parent' : form.role === 'ra' ? '/ra' : '/dashboard';
    navigate(dest);
  };

  const canProceed = () => {
    if (step === 2) return form.name.length > 1 && form.email.includes('@');
    if (step === 3) return form.dormBuilding.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FD] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#3B6FE8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#111827]">MoveSync</h1>
          <p className="text-[#6B7280] mt-1">Your move-in co-pilot</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#E4E7ED] p-8">
          <StepIndicator currentStep={step} totalSteps={4} labels={STEP_LABELS} />

          <div className="mt-8">
            {/* Step 1: Role */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-2">What's your role?</h2>
                <p className="text-sm text-[#6B7280] mb-6">Choose the option that best describes you.</p>
                <div className="flex flex-col gap-3">
                  {(['student', 'parent', 'ra'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => set('role', role)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        form.role === role
                          ? 'border-[#3B6FE8] bg-[#EEF2FD]'
                          : 'border-[#E4E7ED] hover:border-[#3B6FE8]/40'
                      }`}
                    >
                      <span className="text-2xl">
                        {role === 'student' ? '🎒' : role === 'parent' ? '👨‍👩‍👧' : '🏠'}
                      </span>
                      <div>
                        <div className="font-semibold text-[#111827] capitalize">{role === 'ra' ? 'Resident Advisor (RA)' : role}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          {role === 'student' ? 'Track your move-in tasks and coordinate with roommates' :
                           role === 'parent' ? 'Monitor your student\'s move-in progress' :
                           'Manage arrivals, announcements, and resources for your floor'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-2">Tell us about yourself</h2>
                <p className="text-sm text-[#6B7280] mb-6">We'll personalize your experience.</p>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Alex Rivera"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="alex@university.edu"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  {form.role === 'parent' && (
                    <Input
                      label="Student Access Code"
                      placeholder="e.g. ALEX-2024"
                      value={form.parentAccessCode}
                      onChange={(e) => set('parentAccessCode', e.target.value.toUpperCase())}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Residence */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-2">Your residence</h2>
                <p className="text-sm text-[#6B7280] mb-6">Let us know where you're living.</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#111827] block mb-1">University</label>
                    <Select
                      value={form.university}
                      onValueChange={(v) => { set('university', v); set('dormBuilding', DORM_BUILDINGS[v]?.[0] ?? ''); }}
                      options={uniOptions}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#111827] block mb-1">Dorm Building</label>
                    <Select
                      value={form.dormBuilding}
                      onValueChange={(v) => set('dormBuilding', v)}
                      options={dormOptions}
                    />
                  </div>
                  <Input
                    label="Room Number"
                    placeholder="214"
                    value={form.roomNumber}
                    onChange={(e) => set('roomNumber', e.target.value)}
                  />
                  {form.role !== 'parent' && (
                    <>
                      <Input
                        label="Move Date"
                        type="date"
                        value={form.moveDate}
                        onChange={(e) => set('moveDate', e.target.value)}
                      />
                      <div>
                        <label className="text-sm font-medium text-[#111827] block mb-1">Move Type</label>
                        <div className="flex gap-3">
                          {(['move-in', 'move-out'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => set('moveType', t)}
                              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                                form.moveType === t
                                  ? 'border-[#3B6FE8] bg-[#EEF2FD] text-[#3B6FE8]'
                                  : 'border-[#E4E7ED] text-[#6B7280] hover:border-[#3B6FE8]/40'
                              }`}
                            >
                              {t === 'move-in' ? '📦 Move In' : '🚚 Move Out'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-[#111827] mb-2">You're all set!</h2>
                <p className="text-sm text-[#6B7280] mb-6">Review your details before we get started.</p>
                <div className="bg-[#F8F9FC] rounded-xl p-4 flex flex-col gap-3">
                  {[
                    { label: 'Name', value: form.name || '—' },
                    { label: 'Email', value: form.email || '—' },
                    { label: 'Role', value: form.role === 'ra' ? 'Resident Advisor' : form.role.charAt(0).toUpperCase() + form.role.slice(1) },
                    { label: 'University', value: form.university },
                    { label: 'Building', value: form.dormBuilding },
                    { label: 'Room', value: form.roomNumber || '—' },
                    ...(form.role !== 'parent' ? [{ label: 'Move Date', value: form.moveDate }, { label: 'Type', value: form.moveType }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{label}</span>
                      <span className="font-medium text-[#111827] capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)} className="gap-1">
                <ChevronLeft size={16} /> Back
              </Button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="gap-1">
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="gap-1">
                Start Moving! <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
