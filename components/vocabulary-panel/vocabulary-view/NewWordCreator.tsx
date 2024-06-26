'use client';

import { Button } from '@/components/ui/button';
import { WordHandler } from '../word-handler/WordHandler';
import { useState } from 'react';
import { createWord } from '@/lib/utils';
import { Word } from '@/lib/database/models/vocabulary.model';
import { createVocabularyListWord } from '@/lib/actions/vocabulary.actions';
import { AppRouterPath } from '@/constants';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';

export const NewWordCreator = ({ vocId }: { vocId: string }) => {
  const [editedWord, setEditedWord] = useState<Word | null>(null);

  const handleNewWord = () => {
    setEditedWord(createWord({ original: '', translated: '', another: [] }));
  };

  const onSave = async (word: Word) => {
    try {
      await createVocabularyListWord(vocId, word, AppRouterPath.VOCABULARY);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sm:flex hidden ml-10 mr-2">
      <TooltipWrapper text="create new word">
        <Button
          className="bg-original text-white hover:bg-success-hover"
          onClick={handleNewWord}
        >
          Add new word
        </Button>
      </TooltipWrapper>
      <WordHandler
        word={editedWord}
        onClose={() => setEditedWord(null)}
        onSave={onSave}
        isNew={true}
      />
    </div>
  );
};
