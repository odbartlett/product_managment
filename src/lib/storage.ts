const PREFIX = 'movesync_';

export const STORAGE_KEYS = {
  SESSION: `${PREFIX}session`,
  USERS: `${PREFIX}users`,
  TASKS: `${PREFIX}tasks`,
  TIMESLOTS: `${PREFIX}timeslots`,
  SHARED_ITEMS: `${PREFIX}shareditems`,
  ANNOUNCEMENTS: `${PREFIX}announcements`,
  NOTIFICATIONS: `${PREFIX}notifications`,
  FREE_ITEMS: `${PREFIX}freeitems`,
  RESOURCES: `${PREFIX}resources`,
  SEEDED: `${PREFIX}seeded`,
} as const;

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to write to localStorage key: ${key}`);
  }
}

export function storageRemove(key: string): void {
  localStorage.removeItem(key);
}
