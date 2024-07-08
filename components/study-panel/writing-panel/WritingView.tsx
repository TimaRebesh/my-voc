'use client';
import { IConfigurations } from '@/lib/database/models/user.model';
import { Word } from '@/lib/database/models/vocabulary.model';
import { useEffect, useRef, useState } from 'react';
import { StudyingWord } from '../studying-word/StudyingWord';
import { RepeatedConst } from '@/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hint } from './Hint';

type WritingViewProps = {
  studyWord: Word;
  onChange: (value: string) => void;
  isHint: boolean;
  config: IConfigurations;
};

export function WritingView({
  studyWord,
  onChange,
  isHint,
  config,
}: WritingViewProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const useHint = (v: string) => {
    setValue(v);
    inputRef.current?.focus();
  };

  const check = () => onChange(inputRef.current?.value as string);

  return (
    <>
      <StudyingWord
        mode={RepeatedConst.TRANSLATED}
        studyWord={studyWord}
        config={config}
      />
      <div className="flex flex-col space-y-2 w-full m-auto relative items-center justify-center sm:max-w-96">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          className={cn(
            'box-border rounded-[4px] bg-[#faf3b1] border border-solid outline-none',
            isHint && value === studyWord.original ? 'bg-success-light' : ''
          )}
          placeholder="enter word"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => ['Enter'].includes(e.key) && check()}
        />
      </div>
      <Hint
        isHint={isHint}
        studyWord={studyWord}
        value={value}
        setValue={useHint}
      />
      <div className="w-40">
        <Button className="w-full" onClick={check}>
          Check
        </Button>
      </div>
    </>
  );
}
