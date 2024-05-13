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
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { ExportToExcel } from './ExportToExcel';
import { ImportFromExcel } from './ImportToExcel';
import { DeleteVocabulary } from './DeleteVocabulary';
import { Checkbox } from '@/components/ui/checkbox';
import { editVocabulary } from '@/lib/actions/vocabulary.actions';
import { AppRouterPath } from '@/constants';
import { handleError } from '@/lib/utils';


interface Props {
  open: boolean;
  setEditor: (v: boolean) => void;
  voc: IVocabulary;
  vocsCount: number;
  setIsProcessing: (v: boolean) => void;
}

export const Editor = ({
  open,
  setEditor,
  voc,
  vocsCount,
  setIsProcessing,
}: Props) => {

  const [name, setName] = useState<string>(voc.name);
  const [isShared, setIsShared] = useState(voc.isShared);
  const [importedVoc, setImportedVod] = useState<Word[]>([]);

  const onOpenChange = (open: boolean) => {
    if (open) {

    }
    // setEditor(false);
  };

  const onSave = async (e: any) => {
    console.log(e);
    return;
    setIsProcessing(true);
    try {
      await editVocabulary(
        voc._id,
        { name, isShared, list: importedVoc },
        AppRouterPath.VOCABULARY
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDelete = () => {
    console.log(voc._id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start items-start">

          <div className='w-full'>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='cannot be empty' />
          </div>

          <span className="flex items-center space-x-2 pt-2">
            <Checkbox id="terms" checked={isShared} onCheckedChange={(v: boolean) => setIsShared(v)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              do you want sharing this vocabulary with everyone?
            </label>
          </span>

          <ExportToExcel list={voc.list} vocName={name} />
          <ImportFromExcel setData={(voc: Word[]) => setImportedVod(voc)} />

          {vocsCount > 1 && < DeleteVocabulary name={voc.name} onDelete={onDelete} />}

        </div>

        <DialogFooter className="w-full">
          <DialogClose>
            <CustomButton variant='secondary' onClick={() => setEditor(false)} className='w-20 mr-4'>
              Cancel
            </CustomButton>
            <CustomButton className='w-20'>
              Save
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};




