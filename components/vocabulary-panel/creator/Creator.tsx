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
import { Shared } from '../vocabulary-shared/Shared';
import { useToast } from '@/components/ui/use-toast';
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
  const [isShared, setIsShared] =
    useState<IVocabulary[VocabularyFields.IS_SHARED]>(false);
  const [description, setDescription] =
    useState<IVocabulary[VocabularyFields.DESCRIPTION]>('');

  const { toast } = useToast();

  const onOpenChange = (open: boolean) => {
    setName('');
    setIsShared(false);
    setDescription('');
    close();
    if (open) {
    }
  };

  const onSave = async () => {
    setIsProcessing(true);
    const list = [] as IVocabulary[VocabularyFields.LIST];
    try {
      await createVocabularyAndSetAsStudied(
        { name, isShared, list, description, creator: data?.user._id! },
        userId,
        AppRouterPath.VOCABULARY
      );

      // toast({
      //   title: 'Vocabulary has been created',
      // });
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
          <div className="w-full">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                if (e.target.value.length! <= 20) setName(e.target.value);
              }}
              placeholder="cannot be empty"
            />
          </div>

          <Shared
            isShared={isShared}
            setIsShared={(v) => setIsShared(v)}
            description={description}
            setDescription={(v) => setDescription(v)}
          />
        </div>

        <DialogFooter className="w-full">
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
