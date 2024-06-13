'use client';

import { AppRouterPath } from '@/constants';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const HeaderLabel = () => {
  const pathname = usePathname();
  const [label, setLabel] = useState('');

  const selectLabel = () => {
    switch (pathname) {
      case AppRouterPath.SETTINGS:
        return 'SETTINGS';
      case AppRouterPath.REPEAT:
        return 'REPEAT';
      case AppRouterPath.STUDY_NEW:
        return 'STUDY NEW';
      case AppRouterPath.VOCABULARY:
        return 'VOCABULARY';
      case AppRouterPath.LIBRARY:
        return 'LIBRARY';
      default:
        return 'MENU';
    }
  };

  useEffect(() => {
    setLabel(selectLabel());
  }, [pathname]);

  return <p>{label}</p>;
};
