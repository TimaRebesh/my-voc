import { Button } from '@/components/ui/button';
import { AppRouterPath } from '@/constants';
import Link from 'next/link';
import React from 'react';

export default async function () {
  return (
    <div className="flex justify-center mt-20 mx-5">
      <div className="max-w-md flex flex-col gap-7 p-5">
        <Link href={AppRouterPath.REPEAT}>
          <Button className="w-full">Repeat</Button>
        </Link>
        <Link href={AppRouterPath.STUDY_NEW}>
          <Button>Study new words</Button>
        </Link>
      </div>
    </div>
  );
}
