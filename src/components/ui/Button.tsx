import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const VARIANT_CLASSES = {
  primary: 'bg-gold text-navy hover:bg-gold-bright shadow-sm',
  secondary: 'bg-navy text-white hover:bg-navy/90',
  outline: 'border border-navy/20 text-navy hover:bg-navy/5 bg-transparent',
} as const;

const SIZE_CLASSES = {
  sm: 'text-sm px-4 py-2 min-h-[44px]',
  md: 'text-base px-6 py-3 min-h-[44px]',
  lg: 'text-base px-8 py-4 min-h-[52px]',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-heading font-bold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
});
