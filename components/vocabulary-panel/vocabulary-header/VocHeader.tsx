'use client';
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { VocabularySelector } from './VocabularySelector';
import { useState } from 'react';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';
import { WordHandler } from '../word-handler/WordHandler';
import { Button } from '@/components/ui/button';
import { createWord } from '@/lib/utils';
import { createVocabularyListWord } from '@/lib/actions/vocabulary.actions';
import { AppRouterPath } from '@/constants';
import { CreatorButton } from '@/components/creator-button/CreatorButton';

interface Props {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}

export const VocHeader = ({ user, topic, currentVoc }: Props) => {
  const [editedWord, setEditedWord] = useState<Word | null>(null);

  const onSave = async (word: Word) => {
    try {
      await createVocabularyListWord(
        currentVoc._id,
        word,
        AppRouterPath.VOCABULARY
      );
    } catch (err) {}
  };

  return (
    <div className="bg-header h-12 flex items-center sticky">
      <Counter count={currentVoc.list.length} />
      <VocabularySelector user={user} topic={topic} currentVoc={currentVoc} />

      {/* <Button
        onClick={() =>
          setEditedWord(
            createWord({ original: '', translated: '', another: [] })
          )
        }
        className="bg-success hover:bg-success-hover mx-2"
      >
        Add new word
      </Button> */}
      {/* <WordHandler
        word={editedWord}
        onClose={() => setEditedWord(null)}
        onSave={onSave}
        title='New word'
      /> */}
    </div>
  );
};

const Counter = ({ count }: { count: number }) => (
  <div className="text-gray-300 text-[8px] mx-1">{count}</div>
);
