import React from 'react';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';

export const CustomButton = ({
  className,
  variant,
  size,
  onClick,
  disabled,
  children,
}: {
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
  onClick?: () => void;
  disabled?: boolean;
  children: JSX.Element | string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      e.preventDefault();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant, size, className }),
        disabled &&
          'opacity-50 cursor-auto hover:bg-primary hover:text-primary-foreground'
      )}
    >
      {children}
    </div>
  );
};
