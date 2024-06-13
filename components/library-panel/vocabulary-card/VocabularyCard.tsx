'use client';

import { Preloader } from "@/components/preloader/Preloader";
import { getVocabulary } from "@/lib/actions/vocabulary.actions";
import { IVocabulary, IVocabularyWithUserData, Word } from "@/lib/database/models/vocabulary.model";
import { useRef, useState } from "react";
import { ItemView } from "./ItemView";
import { CardHeader } from './CardHeader';

export const VocabularyCard = ({ voc }: { voc: IVocabularyWithUserData; }) => {

  const [list, setList] = useState(voc.list);
  const fullList = useRef<Word[]>([]);
  const [isShown, setIsShown] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFullListVoc = async () => {
    setIsLoading(true);
    try {
      const fullListVoc = await getVocabulary(voc._id) as IVocabulary;
      fullList.current = fullListVoc.list;
      setList(fullList.current);
      setIsShown(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onShow = () => {
    if (isShown === null) {
      getFullListVoc();
    } else {
      if (isShown) {
        setIsShown(false);
        setList(fullList.current.slice(0, 4));
      } else {
        setIsShown(true);
        setList(fullList.current);
      }
    }
  };

  return <>
    <div className='flex-1 voc_card text-[12px]'>
      <CardHeader
        creatorName={voc.creatorData.name}
        creatorAvatar={voc.creatorData.avatar}
        vocName={voc.name}
        description={voc.description}
      />
      <div>
        {list.map((item, ind) => (
          <ItemView key={item.id} item={item} isClosed={list.length - 1 === ind && !isShown} />
        ))}
      </div>
      <div onClick={onShow} className="flex item-center justify-center w-full">
        {!isLoading && <div>{isShown ? 'hide' : 'more'}</div>}
        {isLoading && <Preloader />}
      </div>


    </div>
    {/* <ModalCard
      isOpen={showCard}
      onClose={() => setShowCard(false)}
      prompt={prompt}
    /> */}
  </>;
};
