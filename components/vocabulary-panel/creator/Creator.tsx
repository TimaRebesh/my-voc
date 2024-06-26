'use client';

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
import { useState } from 'react';
import { CustomButton } from '../../ui/custom-button';
import { IVocabulary } from '@/lib/database/models/vocabulary.model';
import { createVocabularyAndSetAsStudied } from '@/lib/actions/vocabulary.actions';
import { AppRouterPath, VocabularyFields } from '@/constants';
import { handleError } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { revalidatePathFromServer } from '@/lib/actions/helpers.actions';

interface Props {
  open: boolean;
  close: () => void;
  setIsProcessing: (v: boolean) => void;
  userId: string;
}

export const Creator = ({ open, close, setIsProcessing, userId }: Props) => {
  const { data, update } = useSession();

  const [name, setName] = useState<IVocabulary[VocabularyFields.NAME]>('');

  const onOpenChange = (open: boolean) => {
    setName('');
    close();
    if (open) {
    }
  };

  const onSave = async () => {
    setIsProcessing(true);
    const list = [] as IVocabulary[VocabularyFields.LIST];
    try {
      await createVocabularyAndSetAsStudied(
        { name, list, creator: data?.user._id! },
        userId,
        AppRouterPath.VOCABULARY
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
      await revalidatePathFromServer(AppRouterPath.VOCABULARY);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Create new vocabulary</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start items-start">
          <div className="w-full mt-4">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                if (e.target.value.length! <= 20) setName(e.target.value);
              }}
              placeholder="cannot be empty"
            />
          </div>
        </div>

        <DialogFooter className="w-full mt-4">
          <DialogClose>
            <CustomButton
              variant="secondary"
              onClick={close}
              className="w-20 mr-4"
            >
              Cancel
            </CustomButton>
            <CustomButton className="w-20" disabled={!name} onClick={onSave}>
              Create
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
