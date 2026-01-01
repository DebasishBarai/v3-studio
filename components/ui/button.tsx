import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm cursor-pointer font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-card hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // NEW PREMIUM VARIANTS
        shimmer: 'relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] text-white font-bold hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300',
        pulse: 'relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/50 before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-indigo-400 before:to-purple-400 before:opacity-0 before:animate-pulse hover:before:opacity-30 before:transition-opacity transition-all duration-300',
        sparkle: 'relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:translate-x-[-200%] before:skew-x-[-45deg] before:opacity-20 hover:before:translate-x-[200%] before:transition-transform before:duration-700 transition-all duration-300',
        press3d: 'relative bg-gradient-to-b from-indigo-500 to-purple-700 text-white font-bold shadow-[0_6px_0_0_#581c87,0_8px_12px_0_rgba(139,92,246,0.4)] hover:shadow-[0_4px_0_0_#581c87,0_6px_12px_0_rgba(139,92,246,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_2px_0_0_#581c87,0_4px_8px_0_rgba(139,92,246,0.4)] transition-all duration-150',
        neon: 'relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold border-2 border-purple-500 hover:border-purple-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
