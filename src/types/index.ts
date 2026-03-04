export type TaskCategory = 'housing' | 'academic' | 'utilities' | 'packing' | 'paperwork' | 'social' | 'financial';
export type UserRole = 'student' | 'parent' | 'ra';
export type MoveType = 'move-in' | 'move-out';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ResourceType = 'trolley' | 'cart' | 'dolly';
export type ItemCondition = 'good' | 'fair' | 'poor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  dormBuilding: string;
  roomNumber: string;
  moveDate: string;
  moveType: MoveType;
  timeSlotId: string | null;
  roommateIds: string[];
  parentAccessCode: string | null;
  linkedStudentId: string | null;
  avatarInitials: string;
  createdAt: string;
}

export interface ChecklistTask {
  id: string;
  userId: string;
  category: TaskCategory;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  isRequired: boolean;
  moveType: MoveType;
  sortOrder: number;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  dormBuilding: string;
  university: string;
}

export interface SharedItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  claimedByUserId: string | null;
  claimedAt: string | null;
  roomKey: string;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  university: string;
  dormBuilding: string | 'all';
  title: string;
  body: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Resource {
  id: string;
  type: ResourceType;
  dormBuilding: string;
  totalCount: number;
  availableCount: number;
  lastUpdated: string;
}

export interface FreeItem {
  id: string;
  listerId: string;
  listerName: string;
  title: string;
  description: string;
  condition: ItemCondition;
  dormBuilding: string;
  roomNumber: string;
  isAvailable: boolean;
  claimedByUserId: string | null;
  createdAt: string;
}

export interface AppSession {
  activeUserId: string | null;
  hasCompletedOnboarding: boolean;
  lastRoute: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'deadline' | 'booking' | 'roommate' | 'announcement';
  isRead: boolean;
  createdAt: string;
}

export interface AppState {
  session: AppSession;
  users: User[];
  tasks: ChecklistTask[];
  timeSlots: TimeSlot[];
  sharedItems: SharedItem[];
  announcements: Announcement[];
  resources: Resource[];
  freeItems: FreeItem[];
  notifications: Notification[];
}

export type AppAction =
  | { type: 'SET_SESSION'; payload: Partial<AppSession> }
  | { type: 'SET_ACTIVE_USER'; payload: string | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<ChecklistTask> } }
  | { type: 'ADD_TASK'; payload: ChecklistTask }
  | { type: 'BOOK_SLOT'; payload: { slotId: string; userId: string } }
  | { type: 'UNBOOK_SLOT'; payload: { slotId: string; userId: string } }
  | { type: 'CLAIM_ITEM'; payload: { itemId: string; userId: string } }
  | { type: 'UNCLAIM_ITEM'; payload: { itemId: string } }
  | { type: 'ADD_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'SEED_DATA'; payload: Partial<AppState> }
  | { type: 'CLAIM_FREE_ITEM'; payload: { itemId: string; userId: string } }
  | { type: 'ADD_FREE_ITEM'; payload: FreeItem }
  | { type: 'UPDATE_RESOURCE'; payload: { id: string; availableCount: number } };
