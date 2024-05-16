import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export const Shared = ({
  isShared,
  setIsShared,
  description,
  setDescription
}: {
  isShared: boolean,
  setIsShared: (v: boolean) => void;
  description?: string;
  setDescription: (v: string) => void;
}) => {
  return (
    <>
      <div>
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="share" checked={isShared} onCheckedChange={setIsShared} />
          <label
            htmlFor="share"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            share
          </label>
        </div>
        <p className='text-xs opacity-70'>{
          isShared
            ? 'this vocabulary is shared for everyone'
            : 'this vocabulary will be shared for everyone'
        }</p>
      </div>
      {isShared &&
        <Textarea
          placeholder="Provide your description here"
          value={description}
          onChange={(v) => setDescription(v.currentTarget.value)}
        />}
    </>
  );
};
