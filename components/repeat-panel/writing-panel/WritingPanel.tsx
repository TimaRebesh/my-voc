'use client';
import { useEffect, useState } from 'react';
import { IConfigurations } from '@/lib/database/models/user.model';
import { Word } from '@/lib/database/models/vocabulary.model';
import { CheerInterface } from '@/utils/hooks';
import { ResultView } from './ResultView';
import { WritingView } from './WritingView';

type WritingProps = {
  studyWord: Word;
  onSave: (isCorrect: boolean) => void;
  isHint: boolean;
  config: IConfigurations;
  cheerControl: CheerInterface;
};

export default function WritingPanel({
  studyWord,
  onSave,
  isHint,
  config,
  cheerControl,
}: WritingProps) {
  const [result, setResult] = useState('');

  useEffect(() => {
    setResult('');
  }, [studyWord]);

  const check = (value: string) => {
    if (value) setResult(value);
  };

  const next = () => onSave(result === studyWord.original);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!result ? (
        <WritingView
          studyWord={studyWord}
          onChange={check}
          isHint={isHint}
          config={config}
        />
      ) : (
        <ResultView
          currentWord={studyWord}
          result={result}
          next={next}
          cheerControl={cheerControl}
        />
      )}
    </div>
  );
}
