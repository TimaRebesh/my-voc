'use client';

import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AppRouterPath } from '@/constants';

export const GoToMenu = () => {
  const pathname = usePathname();

  if (pathname === AppRouterPath.HOME) return null;

  return (
    <Link href="/">
      <ChevronLeftIcon />
    </Link>
  );
};
