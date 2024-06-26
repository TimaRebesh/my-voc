'use client';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { VocabularyCard } from './vocabulary-card/VocabularyCard';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';
import { ISharedVocabulary } from '@/lib/database/models/shared-vocabulary.model';
import { ShareMyVoc } from './share-my-voc/ShareMyVoc';
import { ShareMyVocButton } from './share-my-voc/ShareMyVocButton';

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

  if (vocabularies.length < 1)
    return (
      <div className="flex text-primary justify-center mt-10">
        <p>no shared vocabularies</p>
        <ShareMyVoc user={user} topic={topic} />
      </div>
    );

  return (
    <>
      <div className="sm:flex mt-8 py-2 px-10">
        <Input
          type="text"
          placeholder="Search..."
          className="h-6 sm:max-w-96 sm:flex-1"
          value={searchText}
          onChange={handleSearchChange}
        />
        <div className="sm:block hidden ml-10 mr-2">
          <ShareMyVocButton user={user} topic={topic} />
        </div>
      </div>
      <VocabularyCardList
        data={searchText ? filteredVocs : vocabularies}
        userId={user._id}
        isUserAdmin={!!user.isAdmin}
      />

      <ShareMyVoc user={user} topic={topic} />
    </>
  );
};

const VocabularyCardList = ({
  data,
  userId,
  isUserAdmin,
}: {
  data: ISharedVocabulary[];
  userId: string;
  isUserAdmin: boolean;
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-10 pb-10">
      {data.map((voc) => (
        <VocabularyCard
          key={voc._id}
          voc={voc}
          userId={userId}
          isUserAdmin={isUserAdmin}
        />
      ))}
    </div>
  );
};
