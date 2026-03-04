import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ value, onValueChange, options, placeholder = 'Select...', className, disabled }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg border border-[#E4E7ED] bg-white text-[#111827] min-h-[44px]',
          'hover:border-[#3B6FE8] focus:outline-none focus:ring-2 focus:ring-[#3B6FE8] focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown size={16} className="text-[#6B7280]" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="z-50 overflow-hidden bg-white rounded-xl shadow-xl border border-[#E4E7ED] min-w-[160px]">
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer text-[#111827] hover:bg-[#EEF2FD] hover:text-[#3B6FE8] focus:outline-none data-[highlighted]:bg-[#EEF2FD] data-[highlighted]:text-[#3B6FE8]"
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check size={14} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
