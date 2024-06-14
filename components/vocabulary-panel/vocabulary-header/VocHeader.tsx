import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { VocabularySelector } from './VocabularySelector';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';

export const VocHeader = ({
  user,
  topic,
  currentVoc
}: {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}) => {

  return (
    <div className="bg-header h-12 flex items-center sticky">
      <Counter count={currentVoc.list.length} />
      <VocabularySelector user={user} topic={topic} currentVoc={currentVoc} />
    </div>
  );
};

const Counter = ({ count }: { count: number; }) => (
  <div className="text-gray-300 text-[8px] mx-1">{count}</div>
);
