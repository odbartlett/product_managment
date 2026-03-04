import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Clock, Users, Truck,
  Package, Trash2, Eye, Shield, Wrench
} from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { cn } from '../../lib/utils';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checklist', icon: CheckSquare, label: 'Checklist' },
  { to: '/timeslots', icon: Clock, label: 'Time Slots' },
  { to: '/roommates', icon: Users, label: 'Roommates' },
  { to: '/move-day', icon: Truck, label: 'Move Day' },
  { to: '/resources', icon: Wrench, label: 'Resources' },
  { to: '/move-out', icon: Trash2, label: 'Move Out' },
];

const parentLinks = [
  { to: '/parent', icon: Eye, label: 'Student View' },
];

const raLinks = [
  { to: '/ra', icon: Shield, label: 'RA Dashboard' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
];

export function Sidebar() {
  const { currentUser } = useCurrentUser();

  if (!currentUser) return null;

  const links =
    currentUser.role === 'parent'
      ? parentLinks
      : currentUser.role === 'ra'
      ? raLinks
      : studentLinks;

  return (
    <aside className="hidden md:flex flex-col w-56 fixed left-0 top-14 bottom-0 bg-white border-r border-[#E4E7ED] py-4 z-20">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                isActive
                  ? 'bg-[#EEF2FD] text-[#3B6FE8]'
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-2">
        <div className="text-xs text-[#6B7280] font-medium">{currentUser.name}</div>
        <div className="text-xs text-[#6B7280] capitalize">{currentUser.role} • {currentUser.dormBuilding}</div>
      </div>
    </aside>
  );
}
