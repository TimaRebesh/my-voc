'use client';

import { Preloader } from "@/components/ui/preloader";
import { useRef, useState } from 'react';
import { ItemView } from './ItemView';
import { CardHeader } from './CardHeader';
import {
  ISharedVocabulary,
  ISharedWord,
} from '@/lib/database/models/shared-vocabulary.model';
import { getSharedVocabulary } from '@/lib/actions/shared-vocabulary.actions';

export const VocabularyCard = ({
  voc,
  userId,
}: {
  voc: ISharedVocabulary;

  userId: string;
}) => {
  const [list, setList] = useState(voc.list);
  const fullList = useRef<ISharedWord[]>([]);
  const [isShown, setIsShown] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFullListVoc = async () => {
    setIsLoading(true);
    try {
      const fullListVoc = (await getSharedVocabulary(
        voc._id
      )) as ISharedVocabulary;
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

  return (
    <>
      <div className="flex-1 voc_card text-[12px] leading-none">
        <CardHeader
          voc={voc}
          isUserCreator={voc.creator.creatorId === userId}
          userId={userId}
        />
        <div>
          {list.map((item, ind) => (
            <ItemView
              key={item.id}
              item={item}
              isClosed={list.length - 1 === ind && !isShown}
            />
          ))}
        </div>
        <div
          onClick={onShow}
          className="flex item-center justify-center w-full"
        >
          {!isLoading && <div>{isShown ? 'hide' : 'more'}</div>}
          {isLoading && <Preloader />}
        </div>
      </div>
    </>
  );
};
