import React from 'react';
import { Users, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useRoommates } from '../hooks/useRoommates';
import { PageHeader } from '../components/layout/PageHeader';
import { RoommateCard } from '../components/roommates/RoommateCard';
import { SharedItemRow } from '../components/roommates/SharedItemRow';
import { Card, CardContent } from '../components/ui/Card';
import { toast } from 'react-hot-toast';

export default function RoommatesPage() {
  const { currentUser } = useAppContext();
  const { roommates, sharedItems, claimItem, unclaimItem } = useRoommates();

  if (!currentUser) return null;

  const handleClaim = (itemId: string) => {
    claimItem(itemId);
    toast.success('Item claimed! Your roommate will see this.', { icon: '📦' });
  };

  const handleUnclaim = (itemId: string) => {
    unclaimItem(itemId);
    toast('Item released.', { icon: '🔓' });
  };

  const claimed = sharedItems.filter((i) => i.claimedByUserId !== null).length;

  return (
    <div>
      <PageHeader
        title="Roommates"
        subtitle="Coordinate with your roommates on shared items"
      />

      {/* Roommates */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
          <Users size={16} className="text-[#3B6FE8]" />
          Your Roommates
        </h2>
        {roommates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {roommates.map((r) => <RoommateCard key={r.id} user={r} />)}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-[#6B7280]">
              <p className="text-3xl mb-2">👋</p>
              <p className="font-medium">No roommates linked yet</p>
              <p className="text-sm mt-1">Your RA will connect you once assignments are finalized.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shared items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#111827] flex items-center gap-2">
            <Package size={16} className="text-[#3B6FE8]" />
            Shared Items — Room {currentUser.roomNumber}
          </h2>
          <span className="text-sm text-[#6B7280]">{claimed}/{sharedItems.length} claimed</span>
        </div>

        {sharedItems.length > 0 ? (
          <div className="flex flex-col gap-2">
            {sharedItems.map((item) => (
              <SharedItemRow
                key={item.id}
                item={item}
                currentUserId={currentUser.id}
                onClaim={handleClaim}
                onUnclaim={handleUnclaim}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-[#6B7280]">
              <p>No shared items tracked for this room yet.</p>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-[#6B7280] mt-3">
          Claim items you plan to bring so your roommate knows what's covered.
          Only one person per item.
        </p>
      </div>
    </div>
  );
}
