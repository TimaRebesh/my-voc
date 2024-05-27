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
import { useEffect, useState } from 'react';
import { CustomButton } from '../../ui/custom-button';
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { ExportToExcel } from './ExportToExcel';
import { ImportFromExcel } from './ImportToExcel';
import { DeleteVocabulary } from './DeleteVocabulary';
import { Checkbox } from '@/components/ui/checkbox';
import {
  deleteVocabulary,
  editVocabulary,
} from '@/lib/actions/vocabulary.actions';
import { AppRouterPath } from '@/constants';
import { handleError } from '@/lib/utils';
import { Shared } from '../vocabulary-shared/Shared';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  open: boolean;
  close: () => void;
  currentVoc: IVocabulary;
  setIsProcessing: (v: boolean) => void;
  vocAmount: number;
}

export const Editor = ({
  open,
  close,
  currentVoc,
  setIsProcessing,
  vocAmount,
}: Props) => {
  const [name, setName] = useState<string>(currentVoc.name);
  const [isShared, setIsShared] = useState(currentVoc.isShared);
  const [description, setDescription] = useState(currentVoc.description);
  const [importedVoc, setImportedVoc] = useState<Word[] | null>();
  const [onlyImported, setOnlyImported] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(currentVoc.name);
      setIsShared(currentVoc.isShared);
      setDescription(currentVoc.description);
      setImportedVoc(null);
    }
  }, [open]);

  const save = async () => {
    setIsProcessing(true);
    let list = currentVoc.list;
    if (importedVoc) {
      if (onlyImported) {
        list = importedVoc;
      } else {
        list = [...list, ...importedVoc];
      }
    }
    try {
      await editVocabulary(
        {
          ...currentVoc,
          name,
          isShared,
          description,
          list,
        },
        AppRouterPath.VOCABULARY
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteVocabulary(currentVoc, AppRouterPath.VOCABULARY);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
      close();
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start items-start">
          <div className="w-full">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cannot be empty"
            />
          </div>

          <Shared
            isShared={isShared}
            setIsShared={(v) => setIsShared(v)}
            description={description}
            setDescription={(v) => setDescription(v)}
          />

          <ExportToExcel list={currentVoc.list} vocName={name} />
          <ImportFromExcel setData={(voc: Word[]) => setImportedVoc(voc)} />
          {importedVoc && (
            <div className="flex items-center space-x-2 pt-2 mb-4">
              <Checkbox
                id="onlyImported"
                checked={onlyImported}
                onCheckedChange={(v: boolean) => setOnlyImported(v)}
              />
              <label
                htmlFor="onlyImported"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                save only imported words
              </label>
            </div>
          )}

          {vocAmount > 1 && (
            <DeleteVocabulary name={currentVoc.name} onDelete={onDelete} />
          )}
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
            <CustomButton className="w-20" onClick={save}>
              Save
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
