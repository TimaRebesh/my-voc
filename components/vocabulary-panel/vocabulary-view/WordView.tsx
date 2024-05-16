import { MAX_NUMBER_DEFINING_NEW } from '@/constants';
import { Word } from '@/lib/database/models/vocabulary.model';
import { cn } from '@/lib/utils';

type WordViewProps = {
  word: Word;
  index: number;
  onSave: (w: Word) => void;
  originals: string[];
  remove: (v: Word) => void;
  isNew: boolean;
  passFocus: () => void;
};

export const WordView = (props: WordViewProps) => {
  return (
    <div className="flex p-2 md:p-10 md:px-5 md:py-8 m-1/200 rounded-lg">
      <ProgressBar word={props.word} />
      <p>{props.word.original}</p>
      {/* <EditView
        word={props.word}
        onSave={props.onSave}
        originals={props.originals}
        remove={() => props.remove(props.word)}
        focus={props.isNew && props.index === 0}
        passFocus={props.passFocus}
        theme={props.theme}
      />
      <RemoveButton onClick={() => props.remove(props.word)} theme={props.theme} /> */}
    </div>
  );
};

function ProgressBar({ word }: { word: Word }) {
  const progressStatus =
    word.repeated.original + word.repeated.translated + word.repeated.wrote;
  console.log(progressStatus);
  return (
    <div className="mr-2">
      {Array.from(Array(MAX_NUMBER_DEFINING_NEW).keys())
        .map((el) => (
          <div
            key={el}
            className={cn(
              'w-2 h-1 mb-1 bg-gray-300',
              progressStatus >= el + 1 ? 'bg-green-400' : ''
            )}
          ></div>
        ))
        .reverse()}
      {/* <Tooltip text={`progress: ${progressStatus}`} theme={props.theme} /> */}
    </div>
  );
}
