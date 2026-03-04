import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Clock, Users, MoreHorizontal, Shield, Eye
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { cn } from '../../lib/utils';

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/checklist', icon: CheckSquare, label: 'Tasks' },
  { to: '/timeslots', icon: Clock, label: 'Slots' },
  { to: '/roommates', icon: Users, label: 'Room' },
  { to: '/move-day', icon: MoreHorizontal, label: 'More' },
];

const parentNav = [
  { to: '/parent', icon: Eye, label: 'View' },
];

const raNav = [
  { to: '/ra', icon: Shield, label: 'RA' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
];

export function BottomNav() {
  const { currentUser } = useCurrentUser();
  if (!currentUser) return null;

  const nav =
    currentUser.role === 'parent' ? parentNav :
    currentUser.role === 'ra' ? raNav :
    studentNav;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E4E7ED] pb-safe">
      <div className="flex">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs font-medium transition-colors min-h-[56px]',
                isActive
                  ? 'text-[#3B6FE8]'
                  : 'text-[#6B7280]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
