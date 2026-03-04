import type { ChecklistTask, TaskCategory, TaskPriority } from '../types';

interface TaskTemplate {
  category: TaskCategory;
  title: string;
  description: string;
  priority: TaskPriority;
  isRequired: boolean;
  dueDaysFromMove: number | null;
  sortOrder: number;
}

export const MOVE_IN_TASKS: TaskTemplate[] = [
  {
    category: 'paperwork',
    title: 'Submit Housing Contract',
    description: 'Sign and submit your housing contract through the university portal.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: -30,
    sortOrder: 1,
  },
  {
    category: 'financial',
    title: 'Pay Housing Deposit',
    description: 'Pay the required housing deposit to secure your room assignment.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: -25,
    sortOrder: 2,
  },
  {
    category: 'housing',
    title: 'Review Room Assignment',
    description: 'Check your room assignment details, building, and roommate information.',
    priority: 'high',
    isRequired: true,
    dueDaysFromMove: -20,
    sortOrder: 3,
  },
  {
    category: 'housing',
    title: 'Book Move-In Time Slot',
    description: 'Reserve your preferred move-in time slot to avoid congestion.',
    priority: 'high',
    isRequired: true,
    dueDaysFromMove: -14,
    sortOrder: 4,
  },
  {
    category: 'utilities',
    title: 'Set Up Internet Service',
    description: 'Register your devices for campus WiFi and set up ethernet if needed.',
    priority: 'medium',
    isRequired: false,
    dueDaysFromMove: -7,
    sortOrder: 5,
  },
  {
    category: 'packing',
    title: 'Pack Bedding & Linens',
    description: 'Pack sheets (Twin XL), pillowcases, blanket, and towels.',
    priority: 'high',
    isRequired: true,
    dueDaysFromMove: -3,
    sortOrder: 6,
  },
  {
    category: 'packing',
    title: 'Pack Bathroom Essentials',
    description: 'Shower caddy, toiletries, shower shoes, and bath mat.',
    priority: 'high',
    isRequired: false,
    dueDaysFromMove: -3,
    sortOrder: 7,
  },
  {
    category: 'packing',
    title: 'Pack Academic Supplies',
    description: 'Laptop, notebooks, pens, backpack, and course materials.',
    priority: 'medium',
    isRequired: false,
    dueDaysFromMove: -2,
    sortOrder: 8,
  },
  {
    category: 'academic',
    title: 'Complete Online Orientation',
    description: 'Finish all required online orientation modules before arriving.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: -7,
    sortOrder: 9,
  },
  {
    category: 'social',
    title: 'Connect with Roommate',
    description: 'Reach out to your roommate to coordinate shared items and room setup.',
    priority: 'medium',
    isRequired: false,
    dueDaysFromMove: -14,
    sortOrder: 10,
  },
  {
    category: 'financial',
    title: 'Set Up Meal Plan',
    description: 'Choose and activate your dining plan through the student portal.',
    priority: 'high',
    isRequired: false,
    dueDaysFromMove: -10,
    sortOrder: 11,
  },
  {
    category: 'paperwork',
    title: 'Complete Health Forms',
    description: 'Submit immunization records and health insurance information.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: -21,
    sortOrder: 12,
  },
];

export const MOVE_OUT_TASKS: TaskTemplate[] = [
  {
    category: 'housing',
    title: 'Schedule Move-Out Inspection',
    description: 'Book your room inspection appointment with housing staff.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: -14,
    sortOrder: 1,
  },
  {
    category: 'packing',
    title: 'Start Packing Non-Essentials',
    description: 'Begin packing items you won\'t need in the last week.',
    priority: 'medium',
    isRequired: false,
    dueDaysFromMove: -7,
    sortOrder: 2,
  },
  {
    category: 'housing',
    title: 'Clean Room Thoroughly',
    description: 'Deep clean all surfaces, floors, and bathroom to avoid damage charges.',
    priority: 'high',
    isRequired: true,
    dueDaysFromMove: -1,
    sortOrder: 3,
  },
  {
    category: 'paperwork',
    title: 'Return Room Keys',
    description: 'Return all keys and access cards to the housing office.',
    priority: 'urgent',
    isRequired: true,
    dueDaysFromMove: 0,
    sortOrder: 4,
  },
  {
    category: 'utilities',
    title: 'Cancel/Transfer Subscriptions',
    description: 'Update address for any subscriptions and cancel campus-specific services.',
    priority: 'medium',
    isRequired: false,
    dueDaysFromMove: -7,
    sortOrder: 5,
  },
  {
    category: 'financial',
    title: 'Claim Security Deposit',
    description: 'Ensure your deposit return is processed after successful inspection.',
    priority: 'high',
    isRequired: false,
    dueDaysFromMove: 14,
    sortOrder: 6,
  },
];

export function generateTasksForUser(
  userId: string,
  moveType: 'move-in' | 'move-out',
  moveDate: string
): Omit<ChecklistTask, 'id'>[] {
  const templates = moveType === 'move-in' ? MOVE_IN_TASKS : MOVE_OUT_TASKS;
  const moveDateObj = new Date(moveDate);

  return templates.map((t) => {
    let dueDate: string | null = null;
    if (t.dueDaysFromMove !== null) {
      const due = new Date(moveDateObj);
      due.setDate(due.getDate() + t.dueDaysFromMove);
      dueDate = due.toISOString();
    }
    return {
      userId,
      category: t.category,
      title: t.title,
      description: t.description,
      status: 'pending',
      priority: t.priority,
      dueDate,
      completedAt: null,
      isRequired: t.isRequired,
      moveType,
      sortOrder: t.sortOrder,
    };
  });
}
