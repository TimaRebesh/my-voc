'use client';

import { Preloader } from '@/components/ui/preloader';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { AppRouterPath } from '@/constants';
import { selectTopic } from '@/lib/actions/topics.actions';
import { IVocabulary } from '@/lib/database/models/vocabulary.model';
import { ITopic } from '@/lib/database/models/topic.model';
import { IUser } from '@/lib/database/models/user.model';
import { handleError } from '@/lib/utils';
import { PencilIcon, SquarePlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Creator } from '../creator/Creator';
import { Editor } from '../editor/Editor';

export const VocabularySelector = ({
  user,
  topic,
  currentVoc,
}: {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}) => {
  const router = useRouter();

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onSelectTopic = async (vocabularyId: string) => {
    if (vocabularyId === String(currentVoc._id)) return;

    try {
      setIsProcessing(true);
      await selectTopic(user._id, vocabularyId, AppRouterPath.VOCABULARY);
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center w-full sm:max-w-96 sm:ml-2">
      <select
        value={String(currentVoc._id)}
        disabled={isProcessing}
        onChange={(e) => onSelectTopic(e.target.value)}
        className="mr-4 pl-2 pr-8 w-full h-10 rounded-md border border-input bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {topic.topicList.map((t) => (
          <option key={String(t._id)} value={String(t._id)}>
            {t.name}
          </option>
        ))}
      </select>

      <div className="flex gap-4 ml-auto pr-2">
        <TooltipWrapper text="edit vocabulary">
          <PencilIcon
            className="w-5 h-6 mr-1 text-primary-foreground cursor-pointer"
            onClick={() => setIsEdit(true)}
          />
        </TooltipWrapper>

        <TooltipWrapper text="create new vocabulary">
          <SquarePlusIcon
            className="w-6 h-6 text-primary-foreground cursor-pointer"
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
