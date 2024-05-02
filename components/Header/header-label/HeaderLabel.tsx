'use client';

import { AppRouterPath } from "@/constants";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export const HeaderLabel = () => {

  const pathname = usePathname();
  const [label, setLabel] = useState('');


  useEffect(() => {
    if (pathname === AppRouterPath.HOME) {
      setLabel('Menu');
    }
  }, [pathname]);

  return (
    <div className='text-secondary'>{label}</div>
  );
};
