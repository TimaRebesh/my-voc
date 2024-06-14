import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

export function PreloaderCircle({ className }: { className?: string }) {
  return (
    <LoaderCircle
      className={cn(
        'mr-2 h-10 w-10 animate-spin text-muted-foreground',
        className
      )}
    />
  );
}
