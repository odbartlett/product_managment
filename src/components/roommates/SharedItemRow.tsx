import React, { useState } from 'react';
import { Check, X, User, DollarSign } from 'lucide-react';
import type { SharedItem } from '../../types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/dateUtils';
import { useAppContext } from '../../context/AppContext';

interface SharedItemRowProps {
  item: SharedItem;
  currentUserId: string;
  onClaim: (itemId: string) => void;
  onUnclaim: (itemId: string) => void;
}

export function SharedItemRow({ item, currentUserId, onClaim, onUnclaim }: SharedItemRowProps) {
  const { state, dispatch } = useAppContext();
  const isMine = item.claimedByUserId === currentUserId;
  const isClaimed = item.claimedByUserId !== null;
  const claimer = isClaimed ? state.users.find((u) => u.id === item.claimedByUserId) : null;
  const [priceInput, setPriceInput] = useState(item.price != null ? String(item.price) : '');
  const [editingPrice, setEditingPrice] = useState(false);

  const handlePriceSave = () => {
    const parsed = parseFloat(priceInput);
    dispatch({
      type: 'SET_ITEM_PRICE',
      payload: { itemId: item.id, price: isNaN(parsed) ? null : parsed },
    });
    setEditingPrice(false);
  };

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl border transition-all',
      isMine ? 'border-[#3B6FE8] bg-[#EEF2FD]' : isClaimed ? 'border-gray-200 bg-gray-50 opacity-80' : 'border-[#E4E7ED] bg-white'
    )}>
      <span className="text-2xl flex-shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-[#111827]">{item.name}</div>
        <div className="text-xs text-[#6B7280]">{item.description}</div>
        {isClaimed && claimer && (
          <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7280]">
            <User size={10} />
            <span>
              Claimed by <strong>{claimer.name}</strong>
              {item.claimedAt && ` on ${formatDate(item.claimedAt)}`}
            </span>
          </div>
        )}
        {/* Price row */}
        {isClaimed && (
          <div className="mt-1.5">
            {isMine ? (
              editingPrice ? (
                <div className="flex items-center gap-1">
                  <DollarSign size={11} className="text-[#6B7280]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePriceSave()}
                    autoFocus
                    className="w-20 text-xs border border-[#3B6FE8] rounded px-1.5 py-0.5 outline-none"
                  />
                  <button onClick={handlePriceSave} className="text-xs text-[#3B6FE8] font-medium">Save</button>
                  <button onClick={() => setEditingPrice(false)} className="text-xs text-[#6B7280]">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPrice(true)}
                  className="flex items-center gap-1 text-xs text-[#3B6FE8] hover:underline"
                >
                  <DollarSign size={11} />
                  {item.price != null ? `$${item.price.toFixed(2)}` : 'Add price'}
                </button>
              )
            ) : (
              item.price != null && (
                <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <DollarSign size={11} />
                  ${item.price.toFixed(2)}
                </span>
              )
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        {isMine ? (
          <Button variant="secondary" size="sm" onClick={() => onUnclaim(item.id)} className="gap-1">
            <X size={13} /> Release
          </Button>
        ) : isClaimed ? (
          <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded-lg flex items-center gap-1">
            <Check size={12} className="text-green-600" /> Taken
          </span>
        ) : (
          <Button variant="primary" size="sm" onClick={() => onClaim(item.id)} className="gap-1">
            Claim
          </Button>
        )}
      </div>
    </div>
  );
}
