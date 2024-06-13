'use client';
import { IVocabulary, IVocabularyWithUserData } from '@/lib/database/models/vocabulary.model';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { VocabularyCard } from './vocabulary-card/VocabularyCard';

export const LibraryPanel = ({
  vocabularies
}: {
  vocabularies: IVocabularyWithUserData[];
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredVocs, setFilteredVocs] = useState<IVocabularyWithUserData[]>(vocabularies);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  const filterVocabularies = (searchtext: string) => {
    // const regex = new RegExp(searchtext, "i");
    // return vocabularies.filter(
    //   (voc) =>
    //     regex.test(voc.name) ||
    //     // regex.test(item.prompt)
    // );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(searchTimeoutRef.current);
    setSearchText(e.target.value);

    // debounce method
    // const id = +setTimeout(() => {
    //   const searchResult = filterVocabularies(e.target.value);
    //   setSearchedResults(searchResult);
    // }, 500);
    // setSearchTimeout(id);
  };

  if (vocabularies.length < 1)
    return (
      <div className='flex text-primary justify-center mt-10'>
        <p>no shared vocabularies</p>
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
      <VocabularyCardList data={searchText ? filteredVocs : vocabularies} />
    </>
  );
};

const VocabularyCardList = ({ data }: {
  data: IVocabularyWithUserData[];
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-10 pb-10">
      {data.map(voc => (
        <VocabularyCard key={voc._id} voc={voc} />
      )
      )}
    </div>
  );
};

// className='mt-10 mx-auto w-full max-w-xl flex justify-center items-center flex-col gap-2 px-4'