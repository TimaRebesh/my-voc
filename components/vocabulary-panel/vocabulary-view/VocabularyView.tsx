'use client';

import { Input } from '@/components/ui/input';
import { IVocabulary, Word } from '@/lib/database/models/vocabulary.model';
import { useEffect, useState } from 'react';
import { WordView } from './WordView';
import { IUser } from '@/lib/database/models/user.model';
import { WordHandler } from '../word-handler/WordHandler';
import { AppRouterPath } from '@/constants';
import { editVocabulary } from '@/lib/actions/vocabulary.actions';
import { DialogCustom } from '@/components/ui/dialog-custom';

export const VocabularyView = ({ user, voc }: {
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

  const onSave = async (word: Word) => {
    const updatedList = voc.list.map((elem: Word) => elem.id === word.id ? word : elem);
    voc.list = updatedList;
    await editVocabulary(voc, AppRouterPath.VOCABULARY);
  };

  const onDelete = async (id: string) => {
    const updatedList = voc.list.filter((elem: Word) => elem.id !== id);
    voc.list = updatedList;
    await editVocabulary(voc, AppRouterPath.VOCABULARY);
  };

  if (words.length === 0)
    return (
      <p className="flex item-center justify-center">
        no words. Your vocabulary is empty
      </p>
    );

  return (
    <>
      <button>open</button>
      <DialogCustom isOpen={true} onClose={() => { }} >
        <div>hello</div>
      </DialogCustom>
      <div className="p-2">
        <Input
          type="text"
          placeholder="Search..."
          className="h-6"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
      <div className='flex-1 overflow-y-auto'>
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
        />
      </div>
    </>
  );
};
