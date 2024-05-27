import { MAX_NUMBER_DEFINING_NEW } from '@/constants';
import { Word } from '@/lib/database/models/vocabulary.model';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

type WordViewProps = {
  word: Word;
  edit: () => void;
};

export const WordView = ({ word, edit }: WordViewProps) => {

  return (
    <div
      className="flex p-2 border border-gray-200 hover:border-gray-500 rounded-lg"
      onClick={() => edit()}
    >
      <ProgressBar word={word} />
      <WordComponent word={word} />
    </div>
  );
};

function WordComponent({ word }: { word: Word; }) {
  return (
    <div className='flex-1 flex-coll relative'>
      {word.repeated.prioritized && <StarIcon className='absolute right-0 text-star' fill="currentColor" />}
      <p className='text-original font-semibold'>{word.original}</p>
      <p className='text-translated font-semibold'>{word.translated}</p>
      <div className='flex flex-wrap'>
        {word.another.map((an, ind) =>
          <div
            key={an + ind}
            className='border rounded-full text-[8px] border-gray-400 py-[1px] px-1 mr-1'
          >{an.length > 50 ? `${an.slice(0, 50)}...` : an}</div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ word }: { word: Word; }) {
  const progressStatus =
    word.repeated.original + word.repeated.translated + word.repeated.wrote;

  return (
    <div className="mt-auto pr-2">
      {Array.from(Array(MAX_NUMBER_DEFINING_NEW).keys())
        .map((el) => (
          <div
            key={el}
            className={cn(
              'w-2 h-[6px] mb-[2px] bg-gray-300',
              progressStatus >= el + 1 ? 'bg-original opacity-50' : ''
            )}
          ></div>
        ))
        .reverse()}
    </div>
  );
}
