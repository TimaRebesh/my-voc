import { Word } from '@/lib/database/models/vocabulary.model';
import { cn } from '@/lib/utils';
import { CheerInterface } from '@/utils/hooks';
import { StarIcon } from 'lucide-react';

export function StudyHeader({
  studiedWord,
  cheerControl,
  changeWord,
  showStar,
}: {
  studiedWord: Word | null;
  cheerControl: CheerInterface;
  changeWord: (w: Word) => void;
  showStar: boolean;
}) {
  return (
    <div className="flex items-center justify-center text-primary opacity-50 font-semibold text-2xl h-20">
      {cheerControl.cheer}
      {studiedWord && showStar && (
        <StarIcon
          className={cn(
            studiedWord.repeated.prioritized ? 'text-star' : '',
            'mr-4 absolute right-0 top'
          )}
          {...(studiedWord?.repeated.prioritized
            ? { fill: 'currentColor' }
            : {})}
          onClick={() => {
            const updatedWordWithPriority = {
              ...studiedWord,
              repeated: {
                ...studiedWord.repeated,
                prioritized: !studiedWord.repeated.prioritized,
              },
            };
            changeWord(updatedWordWithPriority);
          }}
        />
      )}
    </div>
  );
}
