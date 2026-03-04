import React, { useEffect } from 'react';
import { Wrench, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import type { ResourceType } from '../types';

const RESOURCE_ICONS: Record<ResourceType, string> = {
  trolley: '🛒',
  cart: '📦',
  dolly: '🔧',
};

const RESOURCE_DESCRIPTIONS: Record<ResourceType, string> = {
  trolley: 'Heavy-duty moving trolley with straps',
  cart: 'Flat-bed cart for boxes and bins',
  dolly: 'Hand dolly for appliances and furniture',
};

function randomize(total: number): number {
  return Math.floor(Math.random() * (total + 1));
}

export default function ResourcesPage() {
  const { state, dispatch } = useAppContext();

  const resources = state.resources;

  // Simulate real-time by randomizing on mount and when refreshed
  const refresh = () => {
    resources.forEach((r) => {
      dispatch({
        type: 'UPDATE_RESOURCE',
        payload: { id: r.id, availableCount: randomize(r.totalCount) },
      });
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Check equipment availability before heading to the building"
        action={
          <Button variant="secondary" size="sm" onClick={refresh} className="gap-1">
            <RefreshCw size={14} /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {resources.map((r) => {
          const pct = r.totalCount > 0 ? r.availableCount / r.totalCount : 0;
          const status = pct === 0 ? 'none' : pct < 0.5 ? 'limited' : 'available';

          return (
            <Card key={r.id}>
              <CardContent className="py-5 text-center">
                <div className="text-3xl mb-2">{RESOURCE_ICONS[r.type]}</div>
                <div className="font-semibold text-[#111827] capitalize">{r.type}s</div>
                <div className="text-xs text-[#6B7280] mb-3">{RESOURCE_DESCRIPTIONS[r.type]}</div>

                {/* Availability */}
                <div className="text-3xl font-bold text-[#111827]">{r.availableCount}</div>
                <div className="text-xs text-[#6B7280]">of {r.totalCount} available</div>

                {/* Bar */}
                <div className="h-2 w-full rounded-full bg-gray-200 mt-3 mb-2">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      status === 'none' ? 'bg-red-500' : status === 'limited' ? 'bg-amber-500' : 'bg-green-500'
                    )}
                    style={{ width: `${(r.availableCount / r.totalCount) * 100}%` }}
                  />
                </div>

                <Badge
                  variant={status === 'none' ? 'danger' : status === 'limited' ? 'warning' : 'success'}
                  className="mt-1"
                >
                  {status === 'none' ? 'None Available' : status === 'limited' ? 'Limited' : 'Available'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="py-4">
          <h3 className="font-semibold text-[#111827] mb-2">How to borrow equipment</h3>
          <ol className="list-decimal list-inside text-sm text-[#6B7280] flex flex-col gap-1">
            <li>Check availability on this page before heading down</li>
            <li>Go to the building entrance and show your student ID</li>
            <li>Sign out the equipment with the RA on duty</li>
            <li>Return it within 2 hours so others can use it</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
