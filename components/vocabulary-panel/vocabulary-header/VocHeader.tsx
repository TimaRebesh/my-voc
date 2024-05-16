'use client';
import { IVocabulary } from "@/lib/database/models/vocabulary.model";
import { VocabularySelector } from "./VocabularySelector";
import { useState } from "react";
import { IUser } from "@/lib/database/models/user.model";
import { ITopic } from "@/lib/database/models/topic.model";

interface Props {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}

export const VocHeader = ({ user, topic, currentVoc }: Props) => {


  return (
    <div className='bg-slate-600 h-12 flex items-center'>
      <Counter count={currentVoc.list.length} />
      <VocabularySelector user={user} topic={topic} currentVoc={currentVoc} />
    </div>
  );
};

const Counter = ({ count }: { count: number; }) =>
  <div className="text-gray-400 text-xs">{count}</div>;
