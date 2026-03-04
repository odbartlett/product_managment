import type { AppState, AppAction } from '../types';
import { STORAGE_KEYS, storageSet } from '../lib/storage';

function persist(state: AppState) {
  storageSet(STORAGE_KEYS.SESSION, state.session);
  storageSet(STORAGE_KEYS.USERS, state.users);
  storageSet(STORAGE_KEYS.TASKS, state.tasks);
  storageSet(STORAGE_KEYS.TIMESLOTS, state.timeSlots);
  storageSet(STORAGE_KEYS.SHARED_ITEMS, state.sharedItems);
  storageSet(STORAGE_KEYS.ANNOUNCEMENTS, state.announcements);
  storageSet(STORAGE_KEYS.FREE_ITEMS, state.freeItems);
  storageSet(STORAGE_KEYS.RESOURCES, state.resources);
  storageSet(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
}

export function appReducer(state: AppState, action: AppAction): AppState {
  let next: AppState;

  switch (action.type) {
    case 'SET_SESSION':
      next = { ...state, session: { ...state.session, ...action.payload } };
      break;

    case 'SET_ACTIVE_USER':
      next = {
        ...state,
        session: { ...state.session, activeUserId: action.payload },
      };
      break;

    case 'ADD_USER':
      next = { ...state, users: [...state.users, action.payload] };
      break;

    case 'UPDATE_TASK':
      next = {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
      break;

    case 'ADD_TASK':
      next = { ...state, tasks: [...state.tasks, action.payload] };
      break;

    case 'BOOK_SLOT': {
      const { slotId, userId } = action.payload;
      const slot = state.timeSlots.find((s) => s.id === slotId);
      if (!slot || slot.bookedCount >= slot.capacity) return state;
      next = {
        ...state,
        timeSlots: state.timeSlots.map((s) =>
          s.id === slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s
        ),
        users: state.users.map((u) =>
          u.id === userId ? { ...u, timeSlotId: slotId } : u
        ),
      };
      break;
    }

    case 'UNBOOK_SLOT': {
      const { slotId, userId } = action.payload;
      next = {
        ...state,
        timeSlots: state.timeSlots.map((s) =>
          s.id === slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
        ),
        users: state.users.map((u) =>
          u.id === userId ? { ...u, timeSlotId: null } : u
        ),
      };
      break;
    }

    case 'CLAIM_ITEM': {
      const { itemId, userId } = action.payload;
      next = {
        ...state,
        sharedItems: state.sharedItems.map((item) =>
          item.id === itemId && item.claimedByUserId === null
            ? { ...item, claimedByUserId: userId, claimedAt: new Date().toISOString() }
            : item
        ),
      };
      break;
    }

    case 'UNCLAIM_ITEM':
      next = {
        ...state,
        sharedItems: state.sharedItems.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, claimedByUserId: null, claimedAt: null }
            : item
        ),
      };
      break;

    case 'ADD_ANNOUNCEMENT':
      next = {
        ...state,
        announcements: [action.payload, ...state.announcements],
      };
      break;

    case 'SEED_DATA':
      next = { ...state, ...action.payload };
      break;

    case 'CLAIM_FREE_ITEM': {
      const { itemId, userId } = action.payload;
      next = {
        ...state,
        freeItems: state.freeItems.map((item) =>
          item.id === itemId && item.isAvailable
            ? { ...item, isAvailable: false, claimedByUserId: userId }
            : item
        ),
      };
      break;
    }

    case 'ADD_FREE_ITEM':
      next = { ...state, freeItems: [...state.freeItems, action.payload] };
      break;

    case 'UPDATE_RESOURCE':
      next = {
        ...state,
        resources: state.resources.map((r) =>
          r.id === action.payload.id
            ? { ...r, availableCount: action.payload.availableCount, lastUpdated: new Date().toISOString() }
            : r
        ),
      };
      break;

    default:
      return state;
  }

  persist(next);
  return next;
}
