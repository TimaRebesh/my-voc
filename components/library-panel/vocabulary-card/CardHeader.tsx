'use client';

import { Avatar } from "@/components/avatar/Avatar";
import { PlusIcon } from "lucide-react";

export const CardHeader = ({
  creatorName,
  creatorAvatar,
  vocName,
  description
}: {
  creatorName: string;
  creatorAvatar: string;
  vocName: string;
  description?: string;
}) => {
  return (
    <>
      <div className='flex justify-between items-start p-2'>
        <div className='flex justify-start items-center gap-3'>
          <Avatar name={creatorName} avatar={creatorAvatar} size={2} />
          <div className='flex flex-col'>
            <h3 className='text-sm font-semibold text-gray-900'>
              {vocName}
            </h3>
            <p className=' text-gray-500'>
              {creatorName}
            </p>
          </div>
        </div>
        <div className='add_btn'>
          <PlusIcon className='bg-original rounded-xl text-white' />
        </div>
      </div>
      <h3 className='p-2'>{description ?? ''}</h3>
    </>
  );
};
