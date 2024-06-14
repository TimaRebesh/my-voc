'use client';
import { IUser } from '@/lib/database/models/user.model';
import {
  IVocabulary,
  Repeated,
  Word,
} from '@/lib/database/models/vocabulary.model';
import { checkSimilarityOfValues, deepCopy } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import {
  PRACTICE_MIN_WORDS,
  defineMode,
  defineOptionalSet,
  prepareListToStudy,
} from './studying-helpers';
import { Preloader } from '../ui/preloader';
import MessagePanel from './message-panel/MessagePanel';
import {
  AppRouterPath,
  MAX_NUMBER_DEFINING_NEW,
  RepeatedConst,
} from '@/constants';
import ChoosePanel from './choose-panel/ChoosePanel';
import WritingPanel from './writing-panel/WritingPanel';
import { useCheer } from '@/utils/hooks';
import { updateVocabularyList } from '@/lib/actions/vocabulary.actions';
import { StudyHeader } from './study-header/StudyHeader';

type Mistake = {
  order: number;
  count: number;
};

interface Props {
  user: IUser;
  vocabulary: IVocabulary;
}

export const RepeatPanel = ({ vocabulary, user }: Props) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dataSet, setDataSet] = useState<Word[]>([]);
  const [studiedOrder, setStudiedOrder] = useState(0);
  const [studiedWord, setStudiedWord] = useState<Word | null>(null);
  const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
  const [mode, setMode] =
    useState<Omit<RepeatedConst, RepeatedConst.PRIORITIZED>>('');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isMistakeTime, setIsMistakeTime] = useState(false);
  const cheerControl = useCheer();
  const isStart = useRef(true);
  const maxCount = 4;

  const saveProgress = async () => {
    if (!checkSimilarityOfValues(vocabulary.list, dataSet)) {
      const updatedList = vocabulary.list.map((w, ind) => {
        const matched = dataSet?.find((d) => d.id === w.id);
        return matched ? matched : w;
      });
      await updateVocabularyList(
        vocabulary._id,
        updatedList,
        AppRouterPath.HOME
      );
    }
  };

  useEffect(() => {
    if (countdown === null) {
      const listToStudy = prepareListToStudy(
        vocabulary.list,
        user.configuration.limitAll
      );
      setDataSet(listToStudy);
      setCountdown(
        listToStudy.length > user.configuration.limitAll
          ? user.configuration.limitAll
          : listToStudy.length
      );
      isStart.current = false;
    }
    if (countdown === 0) {
      saveProgress();
    }
  }, [countdown]);

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
      else mistakes.push({ order: studiedOrder, count: 0 });
      // updating data
      studiedWord.lastRepeat = new Date().getTime();
      const updatedData = dataSet.map((w) =>
        w.id === studiedWord.id ? studiedWord : w
      );
      setDataSet(updatedData);
      // set order
      setNextWordOrder();
      // use countdown
      countdown && setCountdown(() => countdown - 1);
      // updating mistakes
      if (mistakes.length) {
        if (mistakes[0].count === maxCount) mistakes.shift();
        mistakes.forEach((e) => e.count++);
      }
      setMistakes([...mistakes]);
    }
  };

  const setNextWordOrder = () => {
    if (!isMistakeTime) {
      if (dataSet && dataSet.length - 1 === studiedOrder) setStudiedOrder(0);
      else setStudiedOrder(studiedOrder + 1);
    } else setIsMistakeTime(false);
  };

  const again = () => {
    setStudiedOrder(0);
    setOneIterationWords([]);
    setCountdown(null);
  };

  const getPanel = () => {
    if (isStart.current) return <div></div>;
    if (dataSet.length < PRACTICE_MIN_WORDS)
      return (
        <MessagePanel
          legend={'You should have more than 3 learned words'}
          messages={[<>Please study words in "Study new words"</>]}
        />
      );
    else if (countdown === 0)
      return (
        <MessagePanel messages={[<p>Practice is finished</p>]}>
          <button className="button" onClick={again}>
            Try again
          </button>
        </MessagePanel>
      );
    else if (studiedWord)
      return mode !== RepeatedConst.WROTE ? (
        <ChoosePanel
          studyWord={studiedWord}
          optionalWords={oneIterationWords}
          mode={mode}
          onSave={update}
          noNewNumber={MAX_NUMBER_DEFINING_NEW}
          config={user.configuration}
          cheerControl={cheerControl}
        />
      ) : (
        <WritingPanel
          studyWord={studiedWord}
          onSave={update}
          isHint={user.configuration.hints}
          config={user.configuration}
          cheerControl={cheerControl}
        />
      );
    else return <Preloader />;
  };

  return (
    <section className="flex flex-col items-center mx-8">
      <StudyHeader
        cheerControl={cheerControl}
        studiedWord={studiedWord}
        changeWord={setStudiedWord}
        showStar={countdown !== 0}
      />
      {getPanel()}
    </section>
  );
};
