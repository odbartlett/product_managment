import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Package, Users, Bell } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { currentUser, allUsers, switchUser } = useCurrentUser();
  const location = useLocation();

  if (!currentUser) return null;

  const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E4E7ED] h-14">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B6FE8] rounded-lg flex items-center justify-center">
            <Package size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[#111827] text-base">MoveSync</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Demo Role Switcher */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors">
                <Users size={14} />
                <span className="hidden sm:inline">Switch Role</span>
                <ChevronDown size={12} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 bg-white rounded-xl shadow-xl border border-[#E4E7ED] p-1 min-w-[200px]"
                align="end"
                sideOffset={8}
              >
                <div className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                  Demo Mode — Switch User
                </div>
                {allUsers.map((u) => (
                  <DropdownMenu.Item
                    key={u.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
                      u.id === currentUser.id
                        ? 'bg-[#EEF2FD] text-[#3B6FE8]'
                        : 'text-[#111827] hover:bg-gray-50'
                    )}
                    onSelect={() => switchUser(u.id)}
                  >
                    <Avatar initials={u.avatarInitials} size="sm" />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-[#6B7280] capitalize">{u.role}</div>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Current user avatar */}
          <Avatar initials={currentUser.avatarInitials} size="sm" />
        </div>
      </div>
    </header>
  );
}
