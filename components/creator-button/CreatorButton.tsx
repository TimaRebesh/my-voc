import { PlusIcon } from 'lucide-react';

export const CreatorButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <PlusIcon
      className="sm:hidden absolute bottom-10 right-5 bg-original text-white w-12 h-12 rounded-full  cursor-pointer border-8 border-opacity-80"
      onClick={onClick}
    />
  );
};
