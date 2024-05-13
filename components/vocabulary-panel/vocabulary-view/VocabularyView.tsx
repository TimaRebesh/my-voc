'use client';

import { Input } from "@/components/ui/input";
import { IVocabulary, Word } from "@/lib/database/models/vocabulary.model";
import { User } from "next-auth";
import { useRef, useState } from "react";
import { WordView } from "./WordView";
import { getNewID } from "@/lib/utils";

interface Props {
  user: User;
  voc: IVocabulary;
}

export const VocabularyView = ({ user, voc }: Props) => {

  const [words, setWords] = useState<Word[]>(voc.list);
  const [search, setSearch] = useState('');
  const [originals, setOriginals] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);
  const wordsRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<undefined | Object>();

  const filteredWords = search ?
    words.filter(val => val.original.toLowerCase().includes(search.toLowerCase()))
    : words;

  const onChange = (w: Word) => {
    setWords(words.map(el => el.id === w.id ? { ...w, id: getNewID() } : el));
    setIsNew(false);
  };

  const onRemove = (w: Word) => {
    // setWords(words.map(el => el.id === w.id ? { ...w, id: 0 } : el));
    // setIsNew(false);
  };

  const save = () => {
    const withoutEmpty = words.filter(e => (e.original && e.translated));
    // props.onSave(withoutEmpty);
    // props.setPanel('menu');
  };

  if (words.length === 0)
    return <p className='flex item-center justify-center'>no words. Your vocabulary is empty</p>;

  return (
    <section>
      <div className='p-2'>
        <Input
          type='text'
          placeholder="Search...z"
          className="h-6"
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
        />
      </div>
      {filteredWords
        .map((word: Word, index) =>
          <WordView
            key={word.original + index}
            index={index}
            word={word}
            onSave={onChange}
            originals={originals}
            isNew={isNew}
            passFocus={() => setFocus({})}
            remove={onRemove}
          />
        )}
    </section>
  );
};
