'use client';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { VocabularyCard } from './vocabulary-card/VocabularyCard';
import { PlusIcon } from 'lucide-react';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';
import { ISharedVocabulary } from '@/lib/database/models/shared-vocabulary.model';
import { ShareMyVoc } from './share-my-voc/ShareMyVoc';

export const LibraryPanel = ({
  vocabularies,
  user,
  topic,
}: {
  vocabularies: ISharedVocabulary[];
  user: IUser;
  topic: ITopic;
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredVocs, setFilteredVocs] =
    useState<ISharedVocabulary[]>(vocabularies);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  const filterVocabularies = (text: string) => {
    const regex = new RegExp(text, 'i');
    return vocabularies.filter(
      (voc) => regex.test(voc.name) || regex.test(voc.description)
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeoutRef.current);
    setSearchText(e.target.value);

    // debounce method
    const id = +setTimeout(() => {
      const searchResult = filterVocabularies(e.target.value);
      setFilteredVocs(searchResult);
    }, 500);
    searchTimeoutRef.current = id;
  };

  const shareMyVocabulary = () => {};

  if (vocabularies.length < 1)
    return (
      <div className="flex text-primary justify-center mt-10">
        <p>no shared vocabularies</p>
        <ShareMyVoc user={user} topic={topic} />
      </div>
    );

  return (
    <>
      <div className="mt-8 py-2 px-10">
        <Input
          type="text"
          placeholder="Search..."
          className="h-6"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <VocabularyCardList
        data={searchText ? filteredVocs : vocabularies}
        userId={user._id}
      />

      <ShareMyVoc user={user} topic={topic} />
    </>
  );
};

const VocabularyCardList = ({
  data,
  userId,
}: {
  data: ISharedVocabulary[];
  userId: string;
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-10 pb-10">
      {data.map((voc) => (
        <VocabularyCard key={voc._id} voc={voc} userId={userId} />
      ))}
    </div>
  );
};

// className='mt-10 mx-auto w-full max-w-xl flex justify-center items-center flex-col gap-2 px-4'