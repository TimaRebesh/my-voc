'use client';

import { Button } from '@/components/ui/button';
import { MAX_NUMBER_DEFINING_NEW } from '@/constants';
import { Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress } from '@/lib/utils';
import { CheerInterface, LEARNED_WORD_CHEER } from '@/utils/hooks';
import { useEffect } from 'react';

type ResultViesProps = {
  currentWord: Word;
  result: string;
  next: () => void;
  cheerControl: CheerInterface;
};

export function ResultView({
  currentWord,
  result,
  next,
  cheerControl,
}: ResultViesProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [result]);

  useEffect(() => {
    if (currentWord.original === result) {
      const willBeLearned =
        getWordProgress(currentWord) + 1 === MAX_NUMBER_DEFINING_NEW;

      cheerControl.setCheer(willBeLearned ? LEARNED_WORD_CHEER : undefined);
    }
  }, [result, currentWord, cheerControl]);

  const click = () => {
    next();
    cheerControl.clearCheer();
  };

  return (
    <>
      <p className="text-primary text-2xl my-10">{currentWord.original}</p>

      {result !== currentWord.original && (
        <>
          <p>{currentWord.translated}</p>
          <p className="italic line-through text-label my-4">{result}</p>
        </>
      )}

      <Button className="w-40" onClick={click}>
        Next
      </Button>
    </>
  );
}
