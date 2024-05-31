'use client';

import { AppRouterPath } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const VocabularyName = ({ name }: { name: string }) => {
  const pathname = usePathname();

  if (pathname === AppRouterPath.VOCABULARY) return null;

  return (
    <Link
      href={AppRouterPath.VOCABULARY}
      className="absolute top-12 rounded-bl-lg rounded-br-lg bg-label px-2"
    >
      {name}
    </Link>
  );
};
