import { RepeatedConst } from "@/constants";
import { IConfigurations } from "@/lib/database/models/user.model";
import { Word } from "@/lib/database/models/vocabulary.model";

export function StudyingWord(props: {
  mode: Omit<RepeatedConst, RepeatedConst.PRIORITIZED>,
  studyWord: Word,
  config: IConfigurations;
}) {
  return <>
    <div className='flex justify-center p-4 w-full border border-primary rounded-[5px]'>
      <p>{props.mode === 'original' ? props.studyWord.original : props.studyWord.translated}</p>
    </div>
    <div className='min-h-[18px] my-[25px]'>
      {props.studyWord.another.length > 0 && props.config.hints &&
        <div>
          {props.studyWord.another.map((a, ind, ar) =>
            <span
              className='opacity-50 pl-2'
              key={a + ind}
            >{a}{ind !== ar.length - 1 ? ',' : ''}</span>)}
        </div>}
    </div>
  </>;
}
