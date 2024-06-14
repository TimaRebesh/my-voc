import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Repeated, Word } from './database/models/vocabulary.model';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  console.log(error);
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const getWordProgress = (word: Word) =>
  word.repeated.original + word.repeated.translated + word.repeated.wrote;

export const getNewID = () => new Date().getTime().toString();

export function createWord({
  original,
  translated,
  another,
  id,
}: {
  original: string;
  translated: string;
  another: string[];
  id?: string;
}): Word {
  return {
    id: id ?? getNewID(),
    original,
    translated,
    another,
    lastRepeat: 1,
    repeated: { translated: 0, original: 0, wrote: 0, prioritized: false },
  };
}

export const checkSimilarityOfValues = (
  firstElement: Word[],
  secondElement: Word[]
) => JSON.stringify(firstElement) === JSON.stringify(secondElement);

export const shuffle = (data: Word[]) => {
  const arr = [...data];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

export const deepCopy = (value: any) => JSON.parse(JSON.stringify(value));
