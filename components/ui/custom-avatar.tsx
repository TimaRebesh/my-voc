import { cn } from '@/lib/utils';
import React from 'react';
import { TooltipWrapper } from './tooltip-wrapper';

interface CustomAvatarProps {
  src?: string;
  size?: number;
  fallback?: string | JSX.Element;
  tooltipText?: string;
  className?: string;
}

export const CustomAvatar = ({
  src,
  size = 10,
  fallback,
  tooltipText,
  className,
}: CustomAvatarProps) => {
  return (
    <TooltipWrapper text={tooltipText}>
      <div
        className={cn(
          'flex items-center justify-center bg-secondary rounded-full overflow-hidden',
          `w-${size}`,
          `h-${size}`,
          className
        )}
      >
        {src ? (
          <img src={src} alt="Avatar" className="object-cover w-full h-full" />
        ) : (
          <div
            className={cn(
              `w-${size}`,
              `h-${size}`,
              'flex items-center justify-center'
            )}
          >
            {fallback}
          </div>
        )}
      </div>
    </TooltipWrapper>
  );
};
