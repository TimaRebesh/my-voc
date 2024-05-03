'use client';

import { AppRouterPath } from "@/constants";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export const HeaderLabel = () => {

  const pathname = usePathname();
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (pathname === AppRouterPath.HOME) {
      setLabel('MENU');
    } else if (pathname === AppRouterPath.SETTINGS) {
      setLabel('SETTINGS');
    } else if (pathname === AppRouterPath.REPEAT) {
      setLabel('REPEAT');
    } else if (pathname === AppRouterPath.STUDY_NEW) {
      setLabel('STUDY NEW');
    }
  }, [pathname]);

  return (
    <div className='text-secondary'>{label}</div>
  );
};
