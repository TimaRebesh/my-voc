'use client';
import { IUser } from "@/lib/database/models/user.model";
import { IVocabulary, Repeated, Word } from "@/lib/database/models/vocabulary.model";
import { checkSimilarityOfValues, deepCopy, shuffle } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { PRACTICE_MIN_WORDS, checkIsWordNew, defineMode, defineOptionalSet } from "./studying-helpers";
import { Preloader } from "../Preloader/Preloader";
import MessagePanel from "./MessagePanel";
import { MAX_NUMBER_DEFINING_NEW, RepeatedConst } from "@/constants";
import ChoosePanel from "./choose-panel/ChoosePanel";
import WritingPanel from "./writing-panel/WritingPanel";
import { useCheer } from "@/utils/hooks";

type Mistake = {
  order: number,
  count: number;
};

interface Props {
  user: IUser;
  vocabulary: IVocabulary;
}

export const RepeatPanel = ({ vocabulary, user }: Props) => {

  const [countdown, setCountdown] = useState(0);
  const [dataSet, setDataSet] = useState<Word[]>([]);
  const [studiedOrder, setStudiedOrder] = useState(0);
  const [studiedWord, setStudiedWord] = useState<Word>();
  const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
  const [mode, setMode] = useState<Omit<RepeatedConst, RepeatedConst.PRIORITIZED>>('');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isMistakeTime, setIsMistakeTime] = useState(false);
  const cheerControl = useCheer();
  const isStart = useRef(true);
  const maxCount = 4;

  const save = () => {
    saveProgress();
    setCountdown(0);
    // props.setPanel('menu');
  };

  const saveProgress = () => {
    if (!checkSimilarityOfValues(vocabulary.list, dataSet)) {
      const data = vocabulary.list.map((w, ind) => {
        const matched = dataSet?.find(d => d.id === w.id);
        return matched ? matched : w;
      });
      console.log(data);
      // props.onSave(data);
    }
  };

  useEffect(() => {
    const formattedVoc = formatVoc(vocabulary.list);
    setDataSet(formattedVoc);
    setCountdown(((formattedVoc.length > user.configuration.limitAll) ? user.configuration.limitAll : formattedVoc.length));
    isStart.current = false;
  }, [vocabulary]);

  const formatVoc = (list: Word[]) => {
    let filteredByNotNew = list.filter(w => !checkIsWordNew(w));
    filteredByNotNew.sort((a, b) => a.lastRepeat - b.lastRepeat);

    if (filteredByNotNew.length > user.configuration.limitAll)
      filteredByNotNew = filteredByNotNew.slice(0, user.configuration.limitAll);

    const shuffledData = shuffle(filteredByNotNew);
    return shuffledData;
  };

  useEffect(() => {
    if (dataSet.length > 0) {
      defineWords();
      cheerControl.clearCheer();
    }
  }, [dataSet, studiedOrder, mistakes]);


  const defineWords = () => {
    let order = defineOrder();
    setStudiedWord(deepCopy(dataSet[order]));

    const mode = defineMode(dataSet[order], user.configuration.modeWrite);
    setMode(mode);

    const optionalSet = defineOptionalSet(order, vocabulary.list, dataSet);
    setOneIterationWords(optionalSet);
  };

  const defineOrder = () => {
    if (mistakes.length && mistakes[0].count === maxCount) {
      setIsMistakeTime(true);
      return mistakes[0].order;
    }
    return studiedOrder;
  };

  const update = (isCorrectAnswer: boolean) => {
    if (dataSet && studiedWord) {
      const m = mode as keyof Omit<Repeated, RepeatedConst.PRIORITIZED>;
      //save progress or create new mistake
      if (isCorrectAnswer)
        studiedWord.repeated[m] = studiedWord.repeated[m] + 1;
      else
        mistakes.push({ order: studiedOrder, count: 0 });
      // updating data
      studiedWord.lastRepeat = new Date().getTime();
      const updatedData = dataSet.map(w => w.id === studiedWord.id ? studiedWord : w);
      setDataSet(updatedData);
      // set order
      setNextWordOrder();
      // use countdown
      setCountdown(prev => prev - 1);
      // updating mistakes
      if (mistakes.length) {
        if (mistakes[0].count === maxCount)
          mistakes.shift();
        mistakes.forEach(e => e.count++);
      }
      setMistakes([...mistakes]);
    }
  };

  const setNextWordOrder = () => {
    if (!isMistakeTime) {
      if (dataSet && dataSet.length - 1 === studiedOrder)
        setStudiedOrder(0);
      else
        setStudiedOrder(studiedOrder + 1);
    } else
      setIsMistakeTime(false);
  };

  const again = () => {
    setStudiedOrder(0);
    setOneIterationWords([]);
    saveProgress();
  };


  const getPanel = () => {
    if (isStart.current)
      return <div></div>;
    if (dataSet.length < PRACTICE_MIN_WORDS)
      return <MessagePanel legend={'You should have more than 3 learned words'} messages={[<>Please study words in "Study new words"</>]} />;
    else if (countdown === 0)
      return <MessagePanel messages={[<p>Practice is finished</p>]}>
        <button className='button' onClick={again}>Try again</button>
      </MessagePanel>;
    else if (studiedWord)
      return mode === RepeatedConst.WROTE
        ? <ChoosePanel
          studyWord={studiedWord}
          optionalWords={oneIterationWords}
          mode={mode}
          onSave={update}
          noNewNumber={MAX_NUMBER_DEFINING_NEW}
          config={user.configuration}
          cheerControl={cheerControl}
        />
        : <WritingPanel
          studyWord={studiedWord}
          onSave={update}
          isHint={user.configuration.hints}
          config={user.configuration}
          cheerControl={cheerControl}
        />;
    else
      return <Preloader />;
  };

  return (
    <section className="flex flex-col items-center mx-8">
      <div className='flex items-center justify-center text-primary opacity-50 font-semibold text-2xl h-20'>{cheerControl.cheer}</div>
      {getPanel()}
    </section>
  );
};
