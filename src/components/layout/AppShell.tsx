import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Navbar />
      <Sidebar />
      <main className="pt-14 md:pl-56 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
