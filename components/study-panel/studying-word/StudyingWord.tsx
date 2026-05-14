import { MAX_NUMBER_DEFINING_NEW, RepeatedConst } from '@/constants';
import { IConfigurations } from '@/lib/database/models/user.model';
import { Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress } from '@/lib/utils';

export function StudyingWord(props: {
  mode: Omit<RepeatedConst, RepeatedConst.PRIORITIZED>;
  studyWord: Word;
  config: IConfigurations;
  showProgressBadge?: boolean;
}) {
  const progress = getWordProgress(props.studyWord);
  const showProgressBadge =
    props.showProgressBadge && progress >= MAX_NUMBER_DEFINING_NEW;

  return (
    <>
      <div className="relative flex justify-center p-4 w-full border border-primary rounded-[5px] sm:max-w-96">
        {showProgressBadge && (
          <div className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-original px-2 text-[10px] font-semibold text-white shadow-sm">
            {progress}
          </div>
        )}

        <p className="break-all">
          {props.mode === 'original'
            ? props.studyWord.original
            : props.studyWord.translated}
        </p>
      </div>

      <div className="min-h-[18px] my-[25px]">
        {props.studyWord.another.length > 0 && props.config.hints && (
          <div>
            {props.studyWord.another.map((a, ind, ar) => (
              <span className="opacity-50 pl-2" key={a + ind}>
                {a}
                {ind !== ar.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
