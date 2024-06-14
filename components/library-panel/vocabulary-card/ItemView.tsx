import { ISharedWord } from "@/lib/database/models/shared-vocabulary.model";
import { cn } from "@/lib/utils";

export const ItemView = ({
  item,
  isClosed
}: {
  item: ISharedWord;
  isClosed: boolean;
}) => {
  return (
    <div
      key={item.id}
      className={cn(
        "flex flex-col p-1 border border-gray-200 rounded-lg text-[12px]",
        isClosed && 'opacity-20'
      )}>
      <p className="flex-1 text-original font-semibold">{item.original}</p>
      <p className="flex-1 text-translated font-semibold">{item.translated}</p>
    </div>
  );
};
