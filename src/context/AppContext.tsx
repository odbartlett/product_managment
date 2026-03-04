import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppSession } from '../types';
import { appReducer } from './AppReducer';
import { STORAGE_KEYS, storageGet, storageSet } from '../lib/storage';
import { getSeedData } from '../data/mockData';

const defaultSession: AppSession = {
  activeUserId: null,
  hasCompletedOnboarding: false,
  lastRoute: '/',
};

function loadInitialState(): AppState {
  const isSeeded = storageGet<boolean>(STORAGE_KEYS.SEEDED, false);

  const session = storageGet(STORAGE_KEYS.SESSION, defaultSession);
  const users = storageGet(STORAGE_KEYS.USERS, []);
  const tasks = storageGet(STORAGE_KEYS.TASKS, []);
  const timeSlots = storageGet(STORAGE_KEYS.TIMESLOTS, []);
  const sharedItems = storageGet(STORAGE_KEYS.SHARED_ITEMS, []);
  const announcements = storageGet(STORAGE_KEYS.ANNOUNCEMENTS, []);
  const notifications = storageGet(STORAGE_KEYS.NOTIFICATIONS, []);
  const freeItems = storageGet(STORAGE_KEYS.FREE_ITEMS, []);
  const resources = storageGet(STORAGE_KEYS.RESOURCES, []);

  const state: AppState = {
    session,
    users,
    tasks,
    timeSlots,
    sharedItems,
    announcements,
    notifications,
    freeItems,
    resources,
  };

  if (!isSeeded) {
    const seed = getSeedData();
    storageSet(STORAGE_KEYS.SEEDED, true);
    storageSet(STORAGE_KEYS.USERS, seed.users ?? []);
    storageSet(STORAGE_KEYS.TASKS, seed.tasks ?? []);
    storageSet(STORAGE_KEYS.TIMESLOTS, seed.timeSlots ?? []);
    storageSet(STORAGE_KEYS.SHARED_ITEMS, seed.sharedItems ?? []);
    storageSet(STORAGE_KEYS.ANNOUNCEMENTS, seed.announcements ?? []);
    storageSet(STORAGE_KEYS.FREE_ITEMS, seed.freeItems ?? []);
    storageSet(STORAGE_KEYS.RESOURCES, seed.resources ?? []);
    return { ...state, ...seed };
  }

  return state;
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<import('../types').AppAction>;
  currentUser: AppState['users'][number] | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);

  const currentUser = state.users.find((u) => u.id === state.session.activeUserId) ?? null;

  return (
    <AppContext.Provider value={{ state, dispatch, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
