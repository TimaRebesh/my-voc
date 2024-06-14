'use client';
import { IUser } from '@/lib/database/models/user.model';
import { useState } from 'react';
import { Check, PencilIcon, SquarePlusIcon } from 'lucide-react';
import { cn, handleError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { Editor } from '../editor/Editor';
import { Creator } from '../creator/Creator';
import { Preloader } from '@/components/preloader/Preloader';
import { IVocabulary } from '@/lib/database/models/vocabulary.model';
import { AppRouterPath } from '@/constants';
import { ITopic } from '@/lib/database/models/topic.model';
import { selectTopic } from '@/lib/actions/topics.actions';

export const VocabularySelector = ({
  user,
  topic,
  currentVoc,
}: {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}) => {
  const [open, setOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSelectTopic = async (vocabularyId: string) => {
    try {
      await selectTopic(user._id, vocabularyId, AppRouterPath.VOCABULARY);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='flex w-full items-center'>
      <Popover open={open} onOpenChange={setOpen} >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between mr-4 pl-2"
          >
            {currentVoc.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No vocabulary found</CommandEmpty>
            <CommandGroup>
              {topic.topicList.map((t) => (
                <CommandItem
                  key={t._id}
                  value={t.name}
                  onSelect={(currentValue) => {
                    onSelectTopic(t._id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentVoc._id === t._id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {t.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex gap-4 ml-auto pr-2">
        <TooltipWrapper text="edit vocabulary">
          <PencilIcon
            className="w-5 h-6 mr-1 text-primary-foreground"
            onClick={() => {
              setIsEdit(true);
            }}
          />
        </TooltipWrapper>
        <TooltipWrapper text="create new vocabulary">
          <SquarePlusIcon
            className="w-6 h-6 text-primary-foreground"
            onClick={() => setIsCreate(true)}
          />
        </TooltipWrapper>
      </div>
      <Editor
        open={isEdit}
        close={() => setIsEdit(false)}
        currentVoc={currentVoc}
        setIsProcessing={(v) => setIsProcessing(v)}
        vocAmount={topic.topicList.length}
      />
      <Creator
        open={isCreate}
        close={() => setIsCreate(false)}
        setIsProcessing={(v) => setIsProcessing(v)}
        userId={user._id}
      />
      <Preloader isLoading={isProcessing} />
    </div>
  );
};
