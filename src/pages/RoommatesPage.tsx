import React, { useState, useRef, useEffect } from 'react';
import { Users, Package, Plus, Send, MessageCircle, DollarSign, Calculator } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { useRoommates } from '../hooks/useRoommates';
import { PageHeader } from '../components/layout/PageHeader';
import { RoommateCard } from '../components/roommates/RoommateCard';
import { SharedItemRow } from '../components/roommates/SharedItemRow';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import type { SharedItem, RoommateMessage } from '../types';

const EMOJI_OPTIONS = ['📦', '🛋️', '🖥️', '🎮', '📡', '🧊', '☕', '💨', '📺', '🖨️', '🧺', '🪴', '💡', '🎵', '🧹', '🪑'];

export default function RoommatesPage() {
  const { currentUser, state, dispatch } = useAppContext();
  const { roommates, sharedItems, claimItem, unclaimItem } = useRoommates();

  // Add item state
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ name: '', description: '', icon: '📦' });

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const roomKey = `${currentUser.dormBuilding}-${currentUser.roomNumber}`;
  const messages = (state.messages ?? []).filter((m) => m.roomKey === roomKey);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Shared items handlers
  const handleClaim = (itemId: string) => {
    claimItem(itemId);
    toast.success('Item claimed! Your roommate will see this.', { icon: '📦' });
  };

  const handleUnclaim = (itemId: string) => {
    unclaimItem(itemId);
    toast('Item released.', { icon: '🔓' });
  };

  const handleAddItem = () => {
    if (!itemForm.name.trim()) return;
    const item: SharedItem = {
      id: uuidv4(),
      name: itemForm.name.trim(),
      description: itemForm.description.trim(),
      icon: itemForm.icon,
      claimedByUserId: null,
      claimedAt: null,
      roomKey,
      price: null,
    };
    dispatch({ type: 'ADD_SHARED_ITEM', payload: item });
    setItemForm({ name: '', description: '', icon: '📦' });
    setAddItemOpen(false);
    toast.success('Item added to the room list!', { icon: '✅' });
  };

  // Chat handler
  const handleSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    const msg: RoommateMessage = {
      id: uuidv4(),
      roomKey,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderInitials: currentUser.avatarInitials,
      text,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'SEND_ROOMMATE_MESSAGE', payload: msg });
    setChatInput('');
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Expense split calculation
  const allPeople = [currentUser, ...roommates];
  const claimedWithPrice = sharedItems.filter((i) => i.claimedByUserId !== null && (i.price ?? 0) > 0);
  const totalCost = claimedWithPrice.reduce((sum, i) => sum + (i.price ?? 0), 0);
  const fairShare = allPeople.length > 0 ? totalCost / allPeople.length : 0;

  const personSummary = allPeople.map((person) => {
    const theirItems = claimedWithPrice.filter((i) => i.claimedByUserId === person.id);
    const contributed = theirItems.reduce((sum, i) => sum + (i.price ?? 0), 0);
    const balance = contributed - fairShare;
    return { person, theirItems, contributed, balance };
  });

  // Settle: who pays whom
  const settlements: { from: string; to: string; amount: number }[] = [];
  const debtors = personSummary.filter((p) => p.balance < -0.01).map((p) => ({ id: p.person.id, name: p.person.name, owes: -p.balance }));
  const creditors = personSummary.filter((p) => p.balance > 0.01).map((p) => ({ id: p.person.id, name: p.person.name, owed: p.balance }));
  const debtorsCopy = debtors.map((d) => ({ ...d }));
  const creditorsCopy = creditors.map((c) => ({ ...c }));
  let di = 0, ci = 0;
  while (di < debtorsCopy.length && ci < creditorsCopy.length) {
    const pay = Math.min(debtorsCopy[di].owes, creditorsCopy[ci].owed);
    if (pay > 0.01) {
      settlements.push({ from: debtorsCopy[di].name, to: creditorsCopy[ci].name, amount: pay });
    }
    debtorsCopy[di].owes -= pay;
    creditorsCopy[ci].owed -= pay;
    if (debtorsCopy[di].owes < 0.01) di++;
    if (creditorsCopy[ci].owed < 0.01) ci++;
  }

  const claimed = sharedItems.filter((i) => i.claimedByUserId !== null).length;

  function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = diffMs / (1000 * 60 * 60);
    if (diffH < 1) return `${Math.max(1, Math.round(diffMs / 60000))}m ago`;
    if (diffH < 24) return `${Math.round(diffH)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#111827] flex items-center gap-2">
            <Package size={16} className="text-[#3B6FE8]" />
            Shared Items — Room {currentUser.roomNumber}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">{claimed}/{sharedItems.length} claimed</span>
            <Button size="sm" variant="primary" onClick={() => setAddItemOpen(true)} className="gap-1">
              <Plus size={13} /> Add Item
            </Button>
          </div>
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
              <p className="text-3xl mb-2">📦</p>
              <p className="font-medium">No shared items yet</p>
              <p className="text-sm mt-1">Add items you plan to bring so your roommate knows what's covered.</p>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-[#6B7280] mt-3">
          Claim items you plan to bring. Add a price so the split calculator can balance costs automatically.
        </p>
      </div>

      {/* Expense Split */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
          <Calculator size={16} className="text-[#3B6FE8]" />
          Expense Split
        </h2>

        {totalCost === 0 ? (
          <Card>
            <CardContent className="py-5 text-center text-[#6B7280]">
              <DollarSign size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="font-medium text-sm">No priced items yet</p>
              <p className="text-xs mt-1">Claim items and add prices to calculate a fair split.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Summary bar */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#111827]">Total shared cost</span>
                  <span className="text-lg font-bold text-[#111827]">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#6B7280]">
                  <span>Fair share per person ({allPeople.length} people)</span>
                  <span className="font-semibold text-[#3B6FE8]">${fairShare.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Per-person breakdown */}
            <div className="flex flex-col gap-2">
              {personSummary.map(({ person, theirItems, contributed, balance }) => (
                <div
                  key={person.id}
                  className={cn(
                    'rounded-xl border p-3 bg-white',
                    person.id === currentUser.id ? 'border-[#3B6FE8]' : 'border-[#E4E7ED]'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EEF2FD] flex items-center justify-center text-xs font-semibold text-[#3B6FE8]">
                        {person.avatarInitials}
                      </div>
                      <span className="text-sm font-medium text-[#111827]">
                        {person.id === currentUser.id ? 'You' : person.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#111827]">${contributed.toFixed(2)}</span>
                      <span
                        className={cn(
                          'ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full',
                          balance > 0.01
                            ? 'bg-green-100 text-green-700'
                            : balance < -0.01
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-[#6B7280]'
                        )}
                      >
                        {balance > 0.01 ? `+$${balance.toFixed(2)}` : balance < -0.01 ? `-$${Math.abs(balance).toFixed(2)}` : 'even'}
                      </span>
                    </div>
                  </div>
                  {theirItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {theirItems.map((i) => (
                        <span key={i.id} className="text-xs bg-[#F8F9FC] border border-[#E4E7ED] rounded px-1.5 py-0.5 text-[#6B7280]">
                          {i.icon} {i.name} ${(i.price ?? 0).toFixed(2)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Settlement instructions */}
            {settlements.length > 0 && (
              <Card>
                <CardContent className="py-3">
                  <p className="text-xs font-semibold text-[#111827] mb-2">Auto-split settlement</p>
                  <div className="flex flex-col gap-1.5">
                    {settlements.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-[#111827]">{s.from}</span>
                        <span className="text-[#6B7280]">pays</span>
                        <span className="font-medium text-[#111827]">{s.to}</span>
                        <span className="ml-auto font-bold text-[#3B6FE8]">${s.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
          <MessageCircle size={16} className="text-[#3B6FE8]" />
          Room Chat
        </h2>

        <Card>
          {/* Message list */}
          <div className="h-72 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#6B7280] py-8">
                <MessageCircle size={32} className="mb-2 text-gray-200" />
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1">Say hi to your roommate!</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-[#EEF2FD] flex items-center justify-center text-xs font-semibold text-[#3B6FE8] flex-shrink-0 mb-0.5">
                      {msg.senderInitials}
                    </div>
                  )}
                  <div className={cn('max-w-[75%]', isMe && 'items-end flex flex-col')}>
                    {!isMe && (
                      <span className="text-xs text-[#6B7280] mb-0.5 ml-1">{msg.senderName}</span>
                    )}
                    <div
                      className={cn(
                        'px-3 py-2 rounded-2xl text-sm leading-snug',
                        isMe
                          ? 'bg-[#3B6FE8] text-white rounded-br-sm'
                          : 'bg-[#F3F4F6] text-[#111827] rounded-bl-sm'
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] mt-0.5 mx-1">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#E4E7ED] px-3 py-3 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Message your roommate..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-[#E4E7ED] bg-[#F8F9FC] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B6FE8] focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-xl bg-[#3B6FE8] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#2F5DD4] transition-colors flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </Card>
      </div>

      {/* Add Item Modal */}
      <Modal
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        title="Add Shared Item"
        description="Add an item you plan to bring or want to coordinate with your roommate."
      >
        <div className="flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <label className="text-sm font-medium text-[#111827] block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setItemForm((f) => ({ ...f, icon: emoji }))}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-all',
                    itemForm.icon === emoji
                      ? 'border-[#3B6FE8] bg-[#EEF2FD]'
                      : 'border-[#E4E7ED] bg-white hover:border-[#3B6FE8]/40'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Item Name"
            placeholder="Mini fridge, desk lamp, printer..."
            value={itemForm.name}
            onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
          />

          <Input
            label="Description (optional)"
            placeholder="Size, model, or any details..."
            value={itemForm.description}
            onChange={(e) => setItemForm((f) => ({ ...f, description: e.target.value }))}
          />

          <div className="flex gap-2 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setAddItemOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddItem} disabled={!itemForm.name.trim()}>
              Add Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
