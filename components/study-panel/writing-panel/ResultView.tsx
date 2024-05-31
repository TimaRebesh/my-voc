'use client';
import { Button } from '@/components/ui/button';
import { Word } from '@/lib/database/models/vocabulary.model';
import { CheerInterface } from '@/utils/hooks';
import { useEffect, useRef } from 'react';

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
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextButtonRef.current?.focus();
    currentWord.original === result && cheerControl.setCheer();
  }, [result]);

  const click = () => {
    next();
    cheerControl.clearCheer();
  };

  return (
    <>
      <p className="text-primary text-2xl my-10">{currentWord.original}</p>
      {result !== currentWord.original && (
        <>
          <p className="">{currentWord.translated}</p>
          <p className="italic line-through text-label my-4">{result}</p>
        </>
      )}

      <Button
        className="w-40"
        ref={nextButtonRef}
        onClick={next}
        onKeyDown={(e) => ['Enter'].includes(e.key) && click()}
      >
        Next
      </Button>
    </>
  );
}
