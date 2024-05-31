import { MAX_NUMBER_DEFINING_NEW, RepeatedConst } from '@/constants';
import { Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress, shuffle } from '@/lib/utils';

export const PRACTICE_MIN_WORDS = 4;

export const defineMode = (word: Word, modeWrite: boolean) => {
  const { original, translated, wrote } = word.repeated;
  let mode: Omit<RepeatedConst, RepeatedConst.PRIORITIZED>;
  mode =
    original >= translated ? RepeatedConst.TRANSLATED : RepeatedConst.ORIGINAL;
  if (modeWrite) {
    if (mode === RepeatedConst.TRANSLATED && translated > wrote)
      mode = RepeatedConst.WROTE;
  }
  return mode;
};

export const defineOptionalSet = (
  position: number,
  vocabulary: Word[],
  dataSet: Word[]
) => {
  let words: Word[] = [];
  const withoutStudyWordOrderSet = vocabulary.filter(
    (i) => i.id !== dataSet[position].id
  ); // removed word by studyOrder
  const shuffled = shuffle(withoutStudyWordOrderSet); // mixing
  words = shuffled.slice(0, 3); // cut
  words.push(dataSet[position]); // added word by studyOrder like first element
  return shuffle(words);
};

export const setCheer = (currentWord: Word) => {
  const progress = getWordProgress(currentWord) + 1;
  return progress === MAX_NUMBER_DEFINING_NEW ? 'stydied' : 'cheer';
};

export const hideCongrats = () => 'nextWord';

export const isMobile = () => {
  const userAgent = navigator.userAgent;
  // Check for mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
};

export const checkIsWordNew = (word: Word) =>
  getWordProgress(word) < MAX_NUMBER_DEFINING_NEW;

export const prepareListToStudy = (list: Word[], limitAll: number) => {
  const prioritizedWords: Word[] = [];
  const nonPrioritizedWords: Word[] = [];
  // Separate prioritized and non-prioritized words using a standard for loop
  for (let i = 0; i < list.length; i++) {
    const word = list[i];
    if (!checkIsWordNew(word)) {
      if (word.repeated[RepeatedConst.PRIORITIZED]) {
        prioritizedWords.push(word);
      } else {
        nonPrioritizedWords.push(word);
      }
    }
  }

  nonPrioritizedWords.sort((a, b) => b.lastRepeat - a.lastRepeat);

  let combo = [...prioritizedWords, ...nonPrioritizedWords];

  if (combo.length > limitAll) combo = combo.slice(0, limitAll);

  const shuffledData = shuffle(combo);
  return shuffledData;
};
