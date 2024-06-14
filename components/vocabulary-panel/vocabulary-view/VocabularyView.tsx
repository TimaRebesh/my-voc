'use client';

import { Input } from '@/components/ui/input';
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { useEffect, useState } from 'react';
import { WordView } from './WordView';
import { IUser } from '@/lib/database/models/user.model';
import { WordHandler } from '../word-handler/WordHandler';
import { AppRouterPath } from '@/constants';
import {
  deleteVocabularyListWord,
  updateVocabularyListWord,
} from '@/lib/actions/vocabulary.actions';
import { CreatorButton } from '@/components/creator-button/CreatorButton';
import { createWord } from '@/lib/utils';

export const VocabularyView = ({
  user,
  voc,
}: {
  user: IUser;
  voc: IVocabulary;
}) => {
  const [words, setWords] = useState<Word[]>(voc.list);
  const [filteredWords, setFilteredWords] = useState<Word[]>(voc.list);
  const [search, setSearch] = useState('');
  const [editedWord, setEditedWord] = useState<Word | null>(null);

  useEffect(() => {
    setWords(voc.list);
    setFilteredWords(voc.list);
  }, [voc]);

  useEffect(() => {
    setFilteredWords((prev) =>
      search
        ? words.filter((val) =>
          val.original.toLowerCase().includes(search.toLowerCase())
        )
        : words
    );
  }, [search]);

  const handleNewWord = () => {
    setEditedWord(
      createWord({ original: '', translated: '', another: [] })
    );
  };

  const onSave = async (word: Word) => {
    await updateVocabularyListWord(voc._id, word, AppRouterPath.VOCABULARY);
  };

  const onDelete = async (wordId: string) => {
    await deleteVocabularyListWord(voc._id, wordId, AppRouterPath.VOCABULARY);
  };

  return (
    <>
      {words.length > 0 ?
        <div className="p-2">
          <Input
            type="text"
            placeholder="Search..."
            className="h-6"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
        :
        <p className="flex item-center justify-center text-[12px]">
          no words. Your vocabulary is empty
        </p>
      }
      <div className="flex-1 overflow-y-auto">
        {filteredWords.map((word: Word, index) => (
          <WordView
            key={word.original + index}
            word={word}
            edit={() => setEditedWord(word)}
          />
        ))}
        <WordHandler
          word={editedWord}
          onClose={() => setEditedWord(null)}
          onSave={onSave}
          onDelete={onDelete}
          title='Edit word'
        />
        <CreatorButton onClick={handleNewWord} />
      </div>
    </>
  );
};
