import { MAX_NUMBER_DEFINING_NEW } from '@/constants';
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress } from '@/lib/utils';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';
import { NewWordCreator } from '../vocabulary-view/NewWordCreator';
import { VocabularySelector } from './VocabularySelector';

export const VocHeader = ({
  user,
  topic,
  currentVoc,
}: {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}) => {
  return (
    <div className="bg-header h-12 flex items-center sticky">
      <Counter list={currentVoc.list} />
      <VocabularySelector user={user} topic={topic} currentVoc={currentVoc} />
      <NewWordCreator vocId={currentVoc._id} />
    </div>
  );
};

const Counter = ({ list }: { list: Word[]; }) => {
  const allWordsCount = list.length;
  const learnedWordsCount = list.filter(
    (word) => getWordProgress(word) >= MAX_NUMBER_DEFINING_NEW
  ).length;

  return (
    <div className="flex flex-col items-center justify-center leading-none text-gray-300 mx-1 sm:ml-6 min-w-5">
      <span className="text-[11px] sm:text-[13px] font-semibold">
        {allWordsCount}
      </span>
      <span className="text-[8px] sm:text-[9px] opacity-70 pt-1">
        {learnedWordsCount}
      </span>
    </div>
  );
};
