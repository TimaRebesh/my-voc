import { Word } from "@/lib/database/models/vocabulary.model";

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
    <div className=''>
      {props.word.original}
      {/* <ProgressBar progress={props.word} theme={props.theme} />
      <EditView
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