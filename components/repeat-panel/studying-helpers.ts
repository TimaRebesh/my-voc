import { MAX_NUMBER_DEFINING_NEW, RepeatedConst } from '@/constants';
import { Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress, shuffle } from '@/lib/utils';

export const PRACTICE_MIN_WORDS = 4;

export const checkIsWordNew = (word: Word) =>
  getWordProgress(word) < MAX_NUMBER_DEFINING_NEW;

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
