import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { useAppContext } from './context/AppContext';

// Lazy-load pages
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ChecklistPage = lazy(() => import('./pages/ChecklistPage'));
const TimeSlotsPage = lazy(() => import('./pages/TimeSlotsPage'));
const RoommatesPage = lazy(() => import('./pages/RoommatesPage'));
const MoveDayPage = lazy(() => import('./pages/MoveDayPage'));
const ParentViewPage = lazy(() => import('./pages/ParentViewPage'));
const RADashboardPage = lazy(() => import('./pages/RADashboardPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const MoveOutPage = lazy(() => import('./pages/MoveOutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function RootRedirect() {
  const { state, currentUser } = useAppContext();
  if (!state.session.hasCompletedOnboarding || !currentUser) {
    return <Navigate to="/onboarding" replace />;
  }
  if (currentUser.role === 'parent') return <Navigate to="/parent" replace />;
  if (currentUser.role === 'ra') return <Navigate to="/ra" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const { state, currentUser } = useAppContext();
  const isLoggedIn = state.session.hasCompletedOnboarding && currentUser;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3B6FE8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/timeslots" element={<TimeSlotsPage />} />
          <Route path="/roommates" element={<RoommatesPage />} />
          <Route path="/move-day" element={<MoveDayPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/move-out" element={<MoveOutPage />} />
          <Route path="/parent" element={<ParentViewPage />} />
          <Route path="/ra" element={<RADashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              border: '1px solid #E4E7ED',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
