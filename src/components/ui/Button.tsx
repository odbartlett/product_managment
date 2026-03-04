import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
  {
    variants: {
      variant: {
        primary: 'bg-[#3B6FE8] text-white hover:bg-[#2F5EC4] focus:ring-[#3B6FE8] shadow-sm hover:shadow-md',
        secondary: 'bg-white text-[#111827] border border-[#E4E7ED] hover:bg-gray-50 focus:ring-[#3B6FE8] shadow-sm',
        ghost: 'text-[#6B7280] hover:bg-gray-100 hover:text-[#111827] focus:ring-[#3B6FE8]',
        danger: 'bg-[#DC2626] text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
        success: 'bg-[#16A34A] text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm min-h-[36px]',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
