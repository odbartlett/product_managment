import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-[#EEF2FD] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-[#3B6FE8]" />
        </div>
        <h1 className="text-6xl font-bold text-[#3B6FE8] mb-3">404</h1>
        <h2 className="text-xl font-semibold text-[#111827] mb-2">Page not found</h2>
        <p className="text-[#6B7280] mb-8">
          Looks like this box got lost in the move. Let's get you back on track.
        </p>
        <Link to="/dashboard">
          <Button className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
