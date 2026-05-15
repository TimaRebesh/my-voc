'use client';

import { useState } from 'react';

export const LEARNED_WORD_CHEER = 'Congrats, you learned a new word';

export const useCheer = () => {
  const cheers = [
    'good job',
    'well done',
    'excellent',
    'very good',
    'perfect',
    'congrats',
  ];

  const [cheer, setCheerValue] = useState('');

  const setCheer = (message?: string) => {
    setCheerValue(message ?? cheers[Math.floor(Math.random() * cheers.length)]);
  };

  const clearCheer = () => setCheerValue('');

  return {
    cheer,
    setCheer,
    clearCheer,
  } as CheerInterface;
};

export interface CheerInterface {
  cheer: string;
  setCheer: (message?: string) => void;
  clearCheer: () => void;
}
