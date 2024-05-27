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
}: {
  original: string;
  translated: string;
  another: string[];
}): Word {
  return {
    id: getNewID(),
    original,
    translated,
    another,
    lastRepeat: 1,
    repeated: { translated: 0, original: 0, wrote: 0, prioritized: false },
  };
}
