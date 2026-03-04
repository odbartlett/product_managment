import React, { useState } from 'react';
import { Package, Plus, Tag, MapPin } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { FreeItem, ItemCondition } from '../types';
import { formatDate } from '../lib/dateUtils';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

const CONDITION_COLORS: Record<ItemCondition, string> = {
  good: 'bg-green-100 text-green-700',
  fair: 'bg-amber-100 text-amber-700',
  poor: 'bg-red-100 text-red-700',
};

const DONATION_LOCATIONS = [
  { name: 'Housing Office Drop-Off', detail: 'Main building, room 102, open 8am–6pm during move-out' },
  { name: 'Student Union Collection', detail: 'South wing, first floor, all week during finals' },
  { name: 'Campus Thrift Store', detail: 'Behind the gym, accepts furniture and electronics' },
];

export default function MoveOutPage() {
  const { currentUser, state, dispatch } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', condition: 'good' as ItemCondition });

  if (!currentUser) return null;

  const freeItems = state.freeItems;
  const available = freeItems.filter((i) => i.isAvailable);

  const handleAdd = () => {
    if (!form.title) return;
    const item: FreeItem = {
      id: uuidv4(),
      listerId: currentUser.id,
      listerName: currentUser.name,
      title: form.title,
      description: form.description,
      condition: form.condition,
      dormBuilding: currentUser.dormBuilding,
      roomNumber: currentUser.roomNumber,
      isAvailable: true,
      claimedByUserId: null,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_FREE_ITEM', payload: item });
    setForm({ title: '', description: '', condition: 'good' });
    setAddOpen(false);
    toast.success('Item listed! Other students can see it now.', { icon: '🎁' });
  };

  const handleClaim = (itemId: string) => {
    dispatch({ type: 'CLAIM_FREE_ITEM', payload: { itemId, userId: currentUser.id } });
    toast.success('Item claimed! Go pick it up.', { icon: '📦' });
  };

  return (
    <div>
      <PageHeader
        title="Move Out"
        subtitle="Free items from departing students + donation drop-off locations"
        action={
          <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1">
            <Plus size={14} /> List Item
          </Button>
        }
      />

      {/* Free items */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-[#3B6FE8]" />
          <h2 className="font-semibold text-[#111827]">Free Items</h2>
          <Badge variant="primary">{available.length} available</Badge>
        </div>

        {freeItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-[#6B7280]">
              <div className="text-3xl mb-2">🎁</div>
              <p className="font-medium">No free items listed yet</p>
              <p className="text-sm mt-1">Be the first to list something you no longer need!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {freeItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl border p-4 bg-white transition-all',
                  !item.isAvailable && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#111827] text-sm">{item.title}</h3>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full capitalize', CONDITION_COLORS[item.condition])}>
                    {item.condition}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mb-2">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-3">
                  <MapPin size={11} />
                  <span>{item.dormBuilding} · Room {item.roomNumber}</span>
                  <span>·</span>
                  <span>{item.listerName}</span>
                </div>
                {item.isAvailable && item.claimedByUserId === null ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleClaim(item.id)}
                    disabled={item.listerId === currentUser.id}
                  >
                    {item.listerId === currentUser.id ? 'Your Listing' : 'Claim This Item'}
                  </Button>
                ) : (
                  <div className="text-center text-xs text-[#6B7280] bg-gray-100 rounded-lg py-2">
                    {item.claimedByUserId === currentUser.id ? '✅ You claimed this' : '✅ Already claimed'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation locations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-[#3B6FE8]" />
          <h2 className="font-semibold text-[#111827]">Donation Drop-Off Locations</h2>
        </div>
        <div className="flex flex-col gap-3">
          {DONATION_LOCATIONS.map((loc) => (
            <Card key={loc.name}>
              <CardContent className="py-3 flex gap-3 items-start">
                <div className="w-8 h-8 bg-[#EEF2FD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-[#3B6FE8]" />
                </div>
                <div>
                  <div className="font-medium text-sm text-[#111827]">{loc.name}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">{loc.detail}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add item modal */}
      <Modal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="List a Free Item"
        description="Other students can claim items you no longer need"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Item Name"
            placeholder="IKEA lamp, box fan..."
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Textarea
            label="Description (optional)"
            placeholder="Any details about the item..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-[#111827] block mb-1">Condition</label>
            <Select
              value={form.condition}
              onValueChange={(v) => setForm((f) => ({ ...f, condition: v as ItemCondition }))}
              options={[
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
              ]}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAdd} disabled={!form.title}>List Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
