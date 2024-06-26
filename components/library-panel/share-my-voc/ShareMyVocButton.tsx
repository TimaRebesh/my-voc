'use client';

import { CustomButton } from '@/components/ui/custom-button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { ITopic } from '@/lib/database/models/topic.model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSharedVocabulary } from '@/lib/actions/shared-vocabulary.actions';
import { AppRouterPath, VocabularyFields } from '@/constants';
import { IUser } from '@/lib/database/models/user.model';
import { ISharedVocCreator } from '@/lib/database/models/shared-vocabulary.model';
import { CreatorButton } from '@/components/creator-button/CreatorButton';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { Button } from '@/components/ui/button';

export const ShareMyVocButton = ({
  user,
  topic,
}: {
  user: IUser;
  topic: ITopic;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(
      topic.topicList.find((topic) => topic._id === selectedId)?.name || ''
    );
  }, [selectedId]);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setName('');
      setSelectedId('');
      setDescription('');
    }
  };

  const onSave = async () => {
    try {
      const creatorData: ISharedVocCreator = {
        [VocabularyFields.CREATOR_NAME]: user.name,
        [VocabularyFields.CREATOR_AVATAR]: user.avatar ?? '',
        [VocabularyFields.CREATOR_ID]: user._id,
      };
      await createSharedVocabulary(
        selectedId,
        name,
        description,
        creatorData,
        AppRouterPath.LIBRARY
      );
      setIsOpen(false);
    } catch (error) {}
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <TooltipWrapper text="create new word">
          <div
            className="bg-original text-white hover:bg-success-hover px-2 border rounded-sm"
            onClick={() => setIsOpen(true)}
          >
            Share your vocabulary
          </div>
        </TooltipWrapper>
      </DialogTrigger>
      <DialogContent
        className="w-full"
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Share your vocabulary</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start items-start">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a vocabulary" />
            </SelectTrigger>
            <SelectContent>
              {topic.topicList.map((topic) => (
                <SelectItem key={topic._id} value={topic._id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <div className="w-full">
            <Label>Description</Label>
            <Textarea
              className="mb-2"
              placeholder="Provide your description here"
              value={description}
              onChange={(v) => setDescription(v.currentTarget.value)}
            />
          </div>
        </div>

        <DialogFooter className="w-full">
          <DialogClose>
            <CustomButton variant="secondary" className="w-20 mr-4">
              Cancel
            </CustomButton>
            <CustomButton
              className="w-20"
              disabled={!selectedId || !name}
              onClick={onSave}
            >
              Create
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
