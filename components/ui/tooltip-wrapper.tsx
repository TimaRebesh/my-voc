import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface TooltipWrapperProps {
  text?: string;
  children?: ReactNode;
}

export const TooltipWrapper = ({ text, children }: TooltipWrapperProps) =>
  text ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="outline-none">
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-foreground text-background">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <>{children}</>
  );
