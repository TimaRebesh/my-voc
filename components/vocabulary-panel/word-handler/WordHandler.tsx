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
import { CirclePlusIcon, CircleXIcon } from 'lucide-react';
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

  useEffect(() => {
    if (word) {
      setOpen(true);
      setOriginal(word.original);
      setTranslated(word.translated);
      setAnother(word.another);
      setHint('');
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
        another
      });
    }
  };

  const remove = () => {
    onClose();
    setOpen(false);
    word?.id && onDelete && onDelete(word.id);
  };

  return (
    <div className='px-2'>
      <Dialog onOpenChange={close} open={open}>
        <DialogContent className="w-screen">
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
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  value={hint}
                  onChange={(e) => {
                    if (e.target.value.length < 100)
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
          </div>

          <div className='flex'>
            {another.map((an, ind) =>
              <div
                key={an + ind}
                className='flex items-center border rounded-full text-[12px] border-gray-400 h-[20px] px-1 mr-1'
              >{an}
                <CircleXIcon className='w-4' onClick={() => removeHint(ind)} />
              </div>
            )}
          </div>

          {word?.id && onDelete &&
            <p className='text-destructive font-medium' onClick={remove}>Delete</p>
          }

          <DialogFooter className="w-full">
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
    </div>
  );
};
