'use client';
import { IVocabulary } from "@/lib/database/models/vocabulary.model";
import { User } from "next-auth";
import { VocabularySelector } from "./VocabularySelector";
import { useState } from "react";
import { Preloader } from "../../Preloader/Preloader";
import { Editor } from "../editor/Editor";

interface Props {
  user: User;
  voc: IVocabulary;
}

export const VocHeader = ({ user, voc }: Props) => {

  const [isVocEditor, setIsVocEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div>
      <div className='bg-slate-600 h-12 flex items-center'>
        <Counter count={voc.list.length} />
        <VocabularySelector
          topics={user.configuration.vocabularies}
          currentTopic={{ id: voc._id, name: voc.name }}
          setEditor={v => setIsVocEditor(v)}
        />
      </div>

      <Editor
        open={isVocEditor}
        setEditor={v => setIsVocEditor(v)}
        voc={voc}
        vocsCount={user.configuration.vocabularies.length}
        setIsProcessing={() => setIsProcessing(true)}
      />
      <Preloader isLoading={isProcessing} />
    </div>
  );
};

const Counter = ({ count }: { count: number; }) =>
  <div className="text-gray-400 text-xs">{count}</div>;
