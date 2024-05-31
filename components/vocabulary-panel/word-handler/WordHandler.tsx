'use client';
import { CustomButton } from '@/components/ui/custom-button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Word } from '@/lib/database/models/vocabulary.model';
import { cn } from '@/lib/utils';
import { CirclePlusIcon, CircleXIcon, StarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const WordHandler = ({
  word,
  onSave,
  onClose,
  onDelete,
}: {
  word: Word | null;
  onSave: (word: Word) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}) => {

  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState('');
  const [translated, setTranslated] = useState('');
  const [another, setAnother] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [prioritized, setPrioritized] = useState(false);

  useEffect(() => {
    if (word) {
      setOpen(true);
      setOriginal(word.original);
      setTranslated(word.translated);
      setAnother(word.another);
      setHint('');
      setPrioritized(word.repeated.prioritized);
    }
  }, [word]);

  const close = () => {
    onClose();
    setOpen(false);
  };

  const addHint = () => {
    setAnother(prev => [...prev, hint]);
    setHint('');
  };

  const removeHint = (index: number) => {
    setAnother(another.slice(0, index).concat(another.slice(index + 1)));
  };

  const save = () => {
    if (word) {
      onSave({
        ...word,
        original,
        translated,
        another,
        repeated: {
          ...word.repeated,
          prioritized
        }
      });
    }
  };

  const remove = () => {
    onClose();
    setOpen(false);
    word?.id && onDelete && onDelete(word.id);
  };

  return (
    <Dialog onOpenChange={close} open={open}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit word</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start items-start">
          <div className="w-full">
            <Label>Original</Label>
            <Input
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="cannot be empty"
            />
          </div>
          <div className="w-full">
            <Label>Translate</Label>
            <Input
              value={translated}
              onChange={(e) => setTranslated(e.target.value)}
              placeholder="cannot be empty"
            />
          </div>

          <div className="w-full">
            <Label className='opacity-70'>Hints</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                value={hint}
                onChange={(e) => {
                  if (e.target.value.length < 70)
                    setHint(e.target.value);
                }}
                placeholder="add hint"
                className='h-5'
              />
              <CirclePlusIcon className='text-primary' onClick={() => {
                hint.length > 1 && addHint();
              }} />
            </div>
          </div>

          <div className='flex flex-wrap'>
            {another.map((an, ind) =>
              <div
                key={an + ind}
                className='flex items-center border rounded-full text-[12px] border-gray-400 h-[20px] pr-1 mr-1 mb-1'
              >
                <CircleXIcon className='w-4 mx-[2px]' onClick={() => removeHint(ind)} />
                <p>{an.length > 40 ? `${an.slice(0, 40)}...` : an}</p>
              </div>
            )}
          </div>

          {onDelete &&
            <div className='flex flex-wrap items-center' onClick={() => setPrioritized(prev => !prev)}>
              <StarIcon
                className={cn(prioritized ? 'text-star' : '', 'mr-4')}
                {...(prioritized ? { fill: 'currentColor' } : {})}
              />
              <Label className='opacity-70'>always study</Label>
            </div>
          }

          {onDelete &&
            <p className='text-destructive font-medium' onClick={remove}>Delete</p>
          }

        </div>

        <DialogFooter className="w-full mt-5">
          <DialogClose>
            <CustomButton
              variant="secondary"
              className="w-20 mr-4"
            >
              Cancel
            </CustomButton>
            <CustomButton className="w-20" disabled={!original || !translated} onClick={save}>
              Save
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
