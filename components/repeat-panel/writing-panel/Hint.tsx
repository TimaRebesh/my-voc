import { Word } from "@/lib/database/models/vocabulary.model";

type HintProps = {
  isHint: boolean;
  studyWord: Word;
  value: string;
  setValue: (v: string) => void;
};


export const Hint = ({ isHint, studyWord, value, setValue }: HintProps) => {

  const setHint = () => {
    let hint = '';
    for (let i = 0; i <= studyWord.original.length - 1; i++) {
      if (studyWord.original[i] === value[i])
        hint += studyWord.original[i];
      else {
        hint += studyWord.original[i];
        break;
      }
    }
    setValue(hint);
  };

  return <div className='m-8' >
    {isHint &&
      <button
        className='bg-helper w-10 h-10 border-none rounded-full'
        onClick={setHint}>hint</button>
    }
  </div>;
};
