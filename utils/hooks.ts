'use client';
import { useState } from 'react';

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

  const setCheer = () => {
    setCheerValue(cheers[Math.floor(Math.random() * cheers.length)]);
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
  setCheer: () => void;
  clearCheer: () => void;
}
