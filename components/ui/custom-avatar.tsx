import { cn } from '@/lib/utils';
import React from 'react';
import { TooltipWrapper } from './tooltip-wrapper';

interface CustomAvatarProps {
  src?: string;
  width?: number;
  height?: number;
  fallback?: string | JSX.Element;
  tooltipText?: string;
  className?: string;
}

export const CustomAvatar = ({
  src,
  width = 10,
  height = 10,
  fallback,
  tooltipText,
  className,
}: CustomAvatarProps) => {
  return (
    <TooltipWrapper text={tooltipText}>
      <div
        className={cn(
          'flex items-center justify-center bg-secondary rounded-full overflow-hidden',
          `w-${width}`,
          `h-${height}`,
          className
        )}
      >
        {src ? (
          <img src={src} alt="Avatar" className="object-cover w-full h-full" />
        ) : (
          <div
            className={cn(
              `w-${width}`,
              `h-${height}`,
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
