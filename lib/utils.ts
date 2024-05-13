import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Word } from './database/models/vocabulary.model';

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
